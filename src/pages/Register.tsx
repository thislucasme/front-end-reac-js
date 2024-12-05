import React, { useState } from 'react';
import { Box, Button, HStack, Input, Stack, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [isFailure, setIsFailure] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string>()


    const handleRegister = async () => {
        try {
            setIsLoading(true)
            await api.post('/auth/register', { username, email, password });
            setIsLoading(false)
            navigate('/');
        } catch (error: any) {
            setErrorMsg(error?.message)
            setIsFailure(true)
            setIsLoading(false)
        }
    };

    return (
        <Box width="600px" margin="auto">
            <VStack p={10}>
                <Text fontSize={"medium"}>Cadastro</Text>
                <Input placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} />
                <Input placeholder='Email' type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input placeholder='Password' type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button isLoading={isLoading} w={"full"} onClick={handleRegister} colorScheme="green">
                    {isLoading ? "Carregando..." : "Registrar"}
                </Button>
                {isFailure ? <VStack borderRadius={5} w={"full"} m={5} bg={"red.300"}>
                    <Text textColor={"white"}>{errorMsg}</Text>
                </VStack> : <></>}
                <HStack><Text>Já possui uma conta?</Text> <Button onClick={() => navigate("/")} textColor='green' variant="plain">Fazer Login</Button></HStack>
            </VStack>
        </Box>
    );
};

export default Register;
