import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import UserHeader from "./UserHeader";
import UserStats from "./UserStats"
import UserInfoGrid from "./UserInfoGrid"
import UserSecurityCard from "./UserSecurityCard"
import UserActions from "./UserActions"
import { useAdminUserStore } from "../store/useAdminUserStore";
import { useEffect } from "react";



export default function UserDetailsPage() {
  const { id } = useParams();
  const{singleUser, getSingleUser} = useAdminUserStore()  
  
  useEffect(() => {
    getSingleUser(id)
  }, [getSingleUser, id])


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <UserHeader user={singleUser} />

      <UserStats user={singleUser} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <UserInfoGrid user={singleUser} />
        <UserSecurityCard user={singleUser} />
      </div>

      <UserActions user={singleUser} />
    </motion.div>
  );
}
