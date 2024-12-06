import React, { useState } from 'react';
import { Box, Button, HStack, Image, Input, Stack, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import AuthImage from '../resources/auth.svg'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [isFailure, setIsFailure] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string>()

  const handleLogin = async () => {
    try {
      setIsLoading(true)
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('accessToken', response.data.accessToken);
      setIsLoading(false)
      navigate('/products');
    } catch (error: any) {
      setErrorMsg(error?.message)
      setIsFailure(true)
      setIsLoading(false)
    }
  };

  return (
    <Box width="600px" margin="auto">
      <VStack p={10}>
        <Image w={"100px"} src={AuthImage}/>
        <Input placeholder='Email' type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input placeholder='Senha' type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button isLoading={isLoading} w={"full"} onClick={handleLogin} colorScheme="green">
          {isLoading ? "Carregando..." : "Login"}
        </Button>
        {isFailure ? <VStack borderRadius={5} w={"full"} mt={5} bg={"red.300"}>
          <Text textColor={"white"}>{errorMsg}</Text>
        </VStack> : <></>}
        <HStack><Text>Não possui uma conta?</Text> <Button onClick={()=> navigate("/register")} textColor='green' variant="plain">Criar conta</Button></HStack>
      </VStack>
    </Box>
  );
};

export default Login;
