import { IconButton } from "@chakra-ui/react";
import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export const Logout = () =>{
    const navigate = useNavigate()
    return (
        <IconButton size={"sm"} onClick={()=>{
            localStorage.clear();
            navigate("/")
          }} aria-label="sair">
      <FaSignOutAlt />
    </IconButton>
    )
}