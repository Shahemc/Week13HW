import { PrismaClient } from "./generated/prisma/index.js"
const prisma = new PrismaClient();

async function main() {
    //  GET all products -- SELECT * FROM products;
    const products = await prisma.products.findMany()
    console.log("All Products:", products)

    // GET single product -- SELECT * FROM products where id = 1;
    const product = await prisma.products.findUnique({
        where: { id: 1 }
    })
    console.log("Single product:", product)
// GET all products with price less than 50 -- SELECT * FROM products where price < 50;
    const affordable = await prisma.products.findMany({
        where: {
            price: { lt: 50 }
        }
    })
    console.log("Affordable products:", affordable)
    
// GET all products with price less than 50 and category id = 1 -- SELECT * FROM products where price < 50 and category_id = 1;
    const withCategory = await prisma.products.findMany({
        include: {
            categories: true
        }
    })
    console.log("Products with category:", withCategory)

    // ORDER BY price descending... findProductsInDescendingPrice
    const sorted = await prisma.products.findMany({
        orderBy: {
            price: "desc"
        }
    })
    console.log("Sorted products:", sorted)

    // LIMIT
    const top3 = await prisma.products.findMany({
        take: 3,
        orderBy: { price: "desc" }
    })
    console.log("Top 3 most expensive:", top3)
}

main().catch(console.error).finally(() => prisma.$disconnect())