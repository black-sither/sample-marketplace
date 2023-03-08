// Note : tests are assumed to be run on a dummy/ephemeral database instance

import request from "supertest";
import * as dotenv from "dotenv";
import { v4 as uuidv4 } from 'uuid';
dotenv.config();

const port = process.env.PORT || 8080;
const domain = process.env.DOMAIN || 'localhost';

const testSeller = {
  name : `Seller${uuidv4()}`,
  token:null,
  id:null,
  items:[
    {
        "name" : "coke",
        "price" : 90
    },
    {
        "name" : "lays",
        "price" : 10
    }
  ]
}

const testUser = {
  name : `User${uuidv4()}`,
  token:null,
  id:null
}

describe("Happy test flow", () => {
    test("Register User", async () => {
        const res = await request(`${domain}:${port}`)
        .post("/api/auth/register").send({
                username : testUser.name,
                password : "pass123",
                "isSeller" : false
            
        });
        expect(res.status).toEqual(201);
        expect(res.body).toHaveProperty("token")
        expect(res.body).toHaveProperty("id")
        testUser.token = res.body.token
        testUser.id = res.body.id
    });

    test("User Login", async () => {
        const res = await request(`${domain}:${port}`)
        .post("/api/auth/login").send({
                username : testUser.name,
                password : "pass123",
            
        });
        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty("token")
    });
    test("Register Seller", async () => {
      const res = await request(`${domain}:${port}`)
      .post("/api/auth/register").send({
              username : testSeller.name,
              password : "pass123",
              "isSeller" : true
          
      });
      expect(res.status).toEqual(201);
      expect(res.body).toHaveProperty("token")
      testSeller.token = res.body.token
  });

  test("Get all Sellers", async () => {
    const res = await request(`${domain}:${port}`).get("/api/buyer/list-of-sellers")
    .set('Authorization', `Bearer ${testUser.token}`)
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("sellers")
    expect(Array.isArray(res.body.sellers)).toBe(true)
    res.body.sellers.map((seller: any) =>{
      expect(seller).toHaveProperty("name")
      expect(seller).toHaveProperty("sellerId")
    }); 
});

test("Create Catalog for Seller", async () => {
  const res = await request(`${domain}:${port}`).post("/api/seller/create-catalog")
  .send({
    items : testSeller.items
  }).set('Authorization', `Bearer ${testSeller.token}`)
  expect(res.status).toEqual(201);
  expect(res.body).toHaveProperty("catalog")
  expect(Array.isArray(res.body.catalog)).toBe(true)
  res.body.catalog.map((item: any) =>{
    expect(item).toHaveProperty("name")
    expect(item).toHaveProperty("productId")
    expect(item).toHaveProperty("price")
  }); 
});

test("Get Catalog for Seller", async () => {
  const res = await request(`${domain}:${port}`).get(`/api/buyer/seller-catalog/1`)
  .set('Authorization', `Bearer ${testUser.token}`)
  expect(res.status).toEqual(200);
  expect(res.body).toHaveProperty("catalog")
  expect(Array.isArray(res.body.catalog)).toBe(true)
  res.body.catalog.map((item: any) =>{
    expect(item).toHaveProperty("name")
    expect(item).toHaveProperty("productId")
    expect(item).toHaveProperty("price")
  }); 
});

test("Create order", async () => {
  const res = await request(`${domain}:${port}`).post(`/api/buyer/create-order/1`)
  .send({
      items : [
          {
              id : 1,
              quantity : 2
          },
          {
              id : 2,
              quantity : 10
          }
      ]
  })
  .set('Authorization', `Bearer ${testUser.token}`)
  expect(res.status).toEqual(201);
  expect(res.body.order).toHaveProperty("orderId")
  expect(res.body.order).toHaveProperty("totalPrice")
  });

  test("Get All Orders for Seller", async () => {
    const res = await request(`${domain}:${port}`).get(`/api/seller/orders`)
    .set('Authorization', `Bearer ${testSeller.token}`)
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true)
    res.body.map((order: any) =>{
      expect(order).toHaveProperty("orderId")
      expect(order).toHaveProperty("totalPrice")
      expect(order).toHaveProperty("userId")
      expect(order).toHaveProperty("sellerId")
    }); 
  });
});

describe("Invalid Requests", () => {
  test("User tries to create a catalog", async () => {
    const res = await request(`${domain}:${port}`).post("/api/seller/create-catalog")
    .send({
      items : testSeller.items
    }).set('Authorization', `Bearer ${testUser.token}`)
    expect(res.status).toEqual(403);
    expect(res.body.error).toBe('Only Sellers are allowed to create catalog')
  });

  test("Creating Order with item not available with seller", async () => {
  const res = await request(`${domain}:${port}`).post(`/api/buyer/create-order/1`)
  .send({
      items : [
          {
              id : 69,
              quantity : 2
          },
      ]
  })
  .set('Authorization', `Bearer ${testUser.token}`)
  expect(res.status).toEqual(400);
  expect(res.body.error).toBe("One/More items not present with Seller")
  });
});

/* Note further Test cases can be added for the following cases
 - Order created with no items - to be rejected by input Validation
 - Order invalid items from seller
*/ 