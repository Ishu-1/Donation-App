"use client";
import React from "react";
import { Card, CardBody, CardFooter, Button, Image } from "@nextui-org/react";
import { Icon } from "@iconify/react";

const ProductCard = ({ product, onEdit }) => {
  return (
    <Card className="w-full shadow-md hover:shadow-lg transition">
      <CardBody className="p-0">
        <Image
          alt={product.name}
          className="w-full h-52 object-cover rounded-t-md"
          src={product.image[0] || "https://picsum.photos/400/300"}
        />
      </CardBody>
      <CardFooter className="flex flex-col gap-2 p-4">
        <div className="flex justify-between items-start w-full">
          <div>
            <h4 className="text-xl font-bold">{product.name}</h4>
            <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
          </div>
          <Button
            isIconOnly
            color="primary"
            variant="light"
            onPress={() => onEdit(product)}
            className="text-gray-600 hover:text-blue-500"
          >
            <Icon icon="lucide:edit" className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex gap-2">
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
            {product.condition}
          </span>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
