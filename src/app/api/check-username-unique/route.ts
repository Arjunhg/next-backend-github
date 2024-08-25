import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { z }  from 'zod';
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object(
    {
        username: usernameValidation
    }
)

// localhost:3000/api/cuu?username=arjun?

export async function GET(req: Request){

    dbConnect();

    try {

        /**
            const { searchParams } = new URL(req.url);
            // const encodedUsername = searchParams.get('username');
            const queryParams = {
                username: searchParams.get('username')
            }
            // zod validation
            const result = UsernameQuerySchema.safeParse(queryParams);
        */
        
        const { searchParams } = new URL(req.url);
        const encodedUsername = searchParams.get('username');
        const decodedusername = encodedUsername ? decodeURIComponent(encodedUsername) : null;

        // zod validation
        const result = UsernameQuerySchema.safeParse({ username: decodedusername });
        // console.log("Result is: " ,result) -> Result is:  { success: true, data: { username: 'test2' } }

        if(!result.success){

            const usernameError = result.error.format().username?._errors || []

            return Response.json(
                {
                    success: false,
                    message: usernameError?.length > 0 ? usernameError.join(', ') : 'Invalid query parameters'
                },
                {
                    status: 400
                }
            )
        }

        const { username } = result.data;

        const existingVerifiedUser = await UserModel.findOne(
            {
                username,
                isVerified: true,
            }
        )

        if(existingVerifiedUser){

            return Response.json(
                {
                    success: false,
                    message: 'Username already exist'
                },
                {
                    status: 400
                }
            )
        }

        return Response.json(
            {
                success: true,
                message: 'Username is unique'
            },
            {
                status: 200
            }
        )

    } catch (error) {
        
        console.error('Error checking username: ', error);

        return Response.json(
            {
                success: false,
                message: 'Error checking username'
            },
            {
                status: 400
            }
        )
    }
}