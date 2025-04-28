declare interface Product{
    id: string;
    name: string;
    categoryId: string;
    category: Category;
    description: string;
    price: number;
    stock: number;
    imageUrls: string[];
    createdAt: string;
};

declare interface Category{
    id: string;
    name: string;
    description: string;
    imageUrls: string[];
    createdAt: string;
    products : Product[];
};

declare interface CartItem{
    cartId: number;
    id: number;
    productId: string;
    quantity: number;
};

declare interface Cart{
    id: number;
    userId: string;
    createdAt: string;
    updatedAt: string;
    items: CartItem[];
}

declare interface Payment{
    id: string,
    orderId: string,
    amount: number,
    currency: string,
    status: string,
    createdAt: string,
    userId: string, 
    linkId: string,
    productId: string,
}

declare interface User{
    email: string,
    name: string,
    contactNumber: string,
    clerkId: string,
}

declare interface Order{
    id: string;
    amount: number;
    productId: string;
    quantity: number;
    userId: string;
    paymentId: string;
    createdAt: string;
};

declare interface Admin{
    id: string;
    name: string;
    email: string;
    contactNumber: string;
    createdAt: string;
}