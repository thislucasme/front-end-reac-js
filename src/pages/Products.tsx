import { Box, Button, Flex, Image, Input, Text, VStack } from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { ProductContext } from '../contexts/ProductContext';

const Products = () => {
  //const [products, setProducts] = useState<any[]>([]);
  const [isFailure, setIsFailure] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string>()
  const [isToUpdate, setIsToUpdate] = useState(false)
  const [id, setId] = useState("")

  const {
    products, setProducts, salvarProducts,
    setProductImage, productImage, updateProducts,
    productName, setProductName
  } = useContext(ProductContext);


  const salvarProduto = async () => {
    try {
      setIsLoading(true)
      salvarProducts()
      setIsLoading(false)
    } catch (error: any) {
      console.error(error);
      setIsLoading(false)

    }
  };
  const updateProduto = async () => {
    try {
      updateProducts(id)
      setIsToUpdate(false)
      setProductName('');
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




  return (
    <VStack>
      <Text fontSize="2xl" mb={4}>
        Gerenciar Produtos
      </Text>
      <VStack w={"600px"}>
        <Input placeholder='Nome do Produto' type="text" value={productName} onChange={(e) => setProductName(e.target.value)} />
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setProductImage(e.target.files ? e.target.files[0] : null)}
        />
        <Button isLoading={isLoading} isDisabled={productImage ? false : true} w={"full"} onClick={() => { isToUpdate ? updateProduto() : salvarProduto() }} colorScheme='green' variant="solid">{isToUpdate ? "Atualizar" : "Adcionar"}</Button>
      </VStack>
      <Box>
        <Text fontSize="xl" mb={4}>Lista de Produtos</Text>
        {products?.map((product: any) => (
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
