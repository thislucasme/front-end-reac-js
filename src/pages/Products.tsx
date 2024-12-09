import { Box, Button, Flex, Image, Input, Spacer, Text, VStack } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { Logout } from '../componets/Logout';
import { ProductContext } from '../contexts/ProductContext';
import api from '../services/api';
import { Empty } from '../componets/Empty';

const Products = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isToUpdate, setIsToUpdate] = useState(false)
  const [id, setId] = useState("")

  const {
    products, setProducts, salvarProducts,
    setProductImage, productImage, updateProducts,
    productName, setProductName
  } = useContext(ProductContext);


  const salvarProduto = async () => {
    setIsLoading(true)
    await salvarProducts()
    setIsLoading(false)
  };
  const updateProduto = async () => {
    updateProducts(id)
    await setIsToUpdate(false)
    setProductName('');
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
      <VStack>
        <Text fontSize="2xl">
          Gerenciar Produtos
        </Text>
        <Spacer />
        <Logout />
      </VStack>
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
        {products.length <= 0 ? 
        <>
        <Empty/>
        </>
        :<>
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
        </>}
       
      </Box>
    </VStack>
  );
};

export default Products;
