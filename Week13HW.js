import {PrismaClient} from "./generated/prisma/index.js";
const prisma = new PrismaClient();
async function main() {
    // GET products with stock quantity less than 30, sorted by stock_quantity ascending
    const getproducts = await prisma.products.findMany({
    where: { 
        stock_quantity: { lt: 30 } 
    },
    orderBy: { 
        stock_quantity: "asc" 
    },
});
console.log("Products Stock & ASC:", getproducts);
    // GET orders with status delivered, sorted by order_date descending
    const getorders = await prisma.orders.findMany({
    where: {
        status: "delivered"
    },
    orderBy: { 
        order_date: "desc"
    },
    });
console.log("orders delivers & DESC:", getorders);

    const categoryProducts = await prisma.products.findMany({
        select: {
            name: true, 
            price: true,
        categories:{
            select: {
                name: true
            }
            }
        }
    });
    console.log("Category Products:", categoryProducts);
}

main();