
export const extractErrorMessage = (error) => {

    if(!error) return null;

    if(error.response?.data){

        const data=error.response.data;

        // handle zod validation errors
        if(data.errors && Array.isArray(data.errors)){
            return data.errors.map(err=>err.message).join(", ");
        }

        // handle custom error message
        if(data.message){
            return data.message;
        }

        // handle error fields
        if(data.error){
            return data.error;
        }
    }

    // handle network or other errors
    if(error.response && !error.response){
        return "Network error. Please check your connection.";
    }

    // fallback to generic error message

    if(error.message){
        return error.message;
    }

    return "Something went wrong. Please try again.";
}