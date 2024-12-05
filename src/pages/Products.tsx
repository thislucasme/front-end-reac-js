import React, { useEffect, useState } from 'react';
import { Box, Button, Flex, HStack, Image, Input, Text, VStack } from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import api from '../services/api';
import ProductList from '../componets/ProductList';

const Products = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [isFailure, setIsFailure] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string>()
  const [productName, setProductName] = useState<string>("");
  const [isToUpdate, setIsToUpdate] = useState(false)
  const [id, setId] = useState("")
  const [productImage, setProductImage] = useState<File | null>(null);


  const salvarProduto = async () => {
    try {
      const formData = new FormData();
      formData.append('file', productImage!); // Adiciona a imagem
      const uploadResponse = await api.post('/products/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const imageUrl = uploadResponse.data.url;

      await api.post('/products', { name: productName, imageUrl });
      setProductImage(null);
      fetchProducts();
    } catch (error: any) {
      console.error(error);
    }
  };
  const updateProduto = async () => {
    try {

      await api.patch(`/products?id=${id}`, { name: productName });
      setIsToUpdate(false)
      setProductName('');
      fetchProducts();
    } catch (error: any) {
    }
  };

  const handleDelete = async (id: string) => {

    try {
      await api.delete(`/products?id=${id}`);
      setProducts((prev: any) => prev.filter((product: any) => product.id !== id));
    } catch (error) {
      console.log(error);
    }
  };


  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/products');
      setProducts(response.data);
      setIsLoading(false)
    } catch (error: any) {
      setErrorMsg(error.message)
      setIsLoading(false)
    }
  };

  useEffect(() => {


    fetchProducts();
  }, []);

  return (
    <VStack>
      <Text fontSize="2xl" mb={4}>
        Gerenciar Produtos
      </Text>
      <VStack w={"600px"}>
        <Input placeholder='Nome do Produto' type="text" value={productName} onChange={(e) => setProductName(e.target.value)} />
        <Button w={"full"} onClick={() => { isToUpdate ? updateProduto() : salvarProduto() }} colorScheme='green' variant="solid">{isToUpdate ? "Atualizar" : "Adcionar"}</Button>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setProductImage(e.target.files ? e.target.files[0] : null)}
        />
      </VStack>
      <Box>
        <Text fontSize="xl" mb={4}>Lista de Produtos</Text>
        {products.map((product: any) => (
          <Flex key={product.id} justify="space-between" align="center" mb={4}>
            <Image mr={5}
              src={product.imageUrl}
              boxSize="50px"
              borderRadius="full"
              fit="cover"
              alt="Naruto Uzumaki"
            />
            <Text mr={10}>{product.name}</Text>
            <Flex>
              <Button colorScheme="teal" onClick={() => {
                setProductName(product.name)
                setId(product.id)
                setIsToUpdate(true)
              }} mr={2}>
                Editar
              </Button>
              <Button colorScheme="red" onClick={() => handleDelete(product.id)}>
                Deletar
              </Button>
            </Flex>
          </Flex>
        ))}
      </Box>
    </VStack>
  );
};

export default Products;
