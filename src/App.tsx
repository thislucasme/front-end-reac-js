import {
  ChakraProvider,
  theme
} from "@chakra-ui/react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProtectedRoute from "./componets/ProtectedRoute";
import { ProductProvider } from "./contexts/ProductContext";
export const App = () => (
  <ChakraProvider theme={theme}>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <ProductProvider>
                <Products />
              </ProductProvider>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  </ChakraProvider>
)
