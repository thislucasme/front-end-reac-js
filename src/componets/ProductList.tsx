import React from 'react';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import api from '../../src/services/api';


const ProductList = ({ products, setProducts, updateProduto }: any) => {
  const [editingProduct, setEditingProduct] = React.useState<any>(null);

  const handleDelete = async (id: string) => {

    try {
      await api.delete(`/products?id=${id}`);
      setProducts((prev: any) => prev.filter((product: any) => product.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box>
      <Text fontSize="xl" mb={4}>Lista de Produtos</Text>
      {products.map((product: any) => (
        <Flex key={product.id} justify="space-between" align="center" mb={4}>
          <Text mr={10}>{product.name}</Text>
          <Flex>
            <Button colorScheme="teal" onClick={() => setEditingProduct(product)} mr={2}>
              Editar
            </Button>
            <Button colorScheme="red" onClick={() => handleDelete(product.id)}>
              Deletar
            </Button>
          </Flex>
        </Flex>
      ))}
    </Box>
  );
};

export default ProductList;
