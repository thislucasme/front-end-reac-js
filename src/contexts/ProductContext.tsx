import { createContext, ReactNode, useCallback, useEffect, useState } from "react"
import { Product } from "../models/ProductTdo";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

interface ProductContextType {
    products: Product[];
    setProducts: React.Dispatch<React.SetStateAction<Product[] | []>>;
    fetchProducts: () => Promise<void>;
    salvarProducts: () => Promise<void>;
    setProductImage: React.Dispatch<React.SetStateAction<File | null>>;
    productImage: File | null;
    setProductName: React.Dispatch<React.SetStateAction<string>>;
    productName: string;
    updateProducts: (id: string) => Promise<void>;
}
export const ProductContext = createContext<ProductContextType>({
    products: [],
    setProducts: () => { },
    fetchProducts: async () => { },
    salvarProducts: async () => { },
    setProductImage: () => { },
    productImage: null,
    setProductName: () => { },
    productName: "",
    updateProducts: async (id: string) => { },
});

interface ProductProviderProps {
    children: ReactNode
}
export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [productImage, setProductImage] = useState<File | null>(null);
    const [productName, setProductName] = useState<string>("");
    const navigate = useNavigate();

    const fetchProducts = useCallback(async () => {
        try {
            const response = await api.get('/products');
            setProducts(response.data);
        } catch (error: any) {

            if (error.response && error.response.status === 401) {
                console.error('Not Authorized. Redirecting to login...');
                navigate("/")
            } else {
                console.error('Error fetching products:', error);
            }
        }
    }, []);

    const salvarProducts = useCallback(async () => {
        try {
            if (!productImage) {
                console.error('Product image is required');
                return;
            }

            const formData = new FormData();
            formData.append('file', productImage);
            const uploadResponse = await api.post('/products/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const imageUrl = uploadResponse.data.url;

            await api.post('/products', { name: productName, imageUrl });
            fetchProducts();
        } catch (error: any) {
            console.error('Error saving product:', error);
        }
    }, [productImage, productName, fetchProducts]);


    const updateProducts = useCallback(async (id: string) => {

        try {
            if (!productImage) {
                console.error('Product image is required');
                return;
            }

            const formData = new FormData();
            formData.append('file', productImage);
            const uploadResponse = await api.post('/products/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const imageUrl = uploadResponse.data.url;

            await api.patch(`/products?id=${id}`, { name: productName, imageUrl});
        } catch (error: any) {
            console.error("Erro ao atualizar um item.", error)
        }
        fetchProducts();
    }, [fetchProducts, productImage, productName])

    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])

    return (
        <ProductContext.Provider value={{
            salvarProducts,
            setProducts,
            products, fetchProducts, productImage, setProductImage,
            setProductName, productName,
            updateProducts
        }}>
            {children}
        </ProductContext.Provider>
    )
}