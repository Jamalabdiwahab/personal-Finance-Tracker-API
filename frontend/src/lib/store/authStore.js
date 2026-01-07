import { create } from 'zustand'
import { persist } from 'zustand/middleware'


const useAuthStore=create(

    persist(

        (set,get)=>({
            user:null,
            token:null,
            isAuthenticated:false,


            // set user data and token after login or register
            setAuthData:( token, user)=>{
                set({
                    user,
                    token,
                    isAuthenticated:true
                })
            },

            // clear user data and token on logout
            clearAuthData:()=>{
                set({
                    user:null,
                    token:null,
                    isAuthenticated:false
                })
            },

            // get token (for use outside react components)
            getToken:()=> get().token,
        }),
        {
            name:'auth-storage', // name of the storage (localStorage key)
            partialize:(state)=>({
                user:state.user,
                token:state.token,
                isAuthenticated:state.isAuthenticated
            })
        }
    )
)
export default useAuthStore;