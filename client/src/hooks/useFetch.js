import { useState, useEffect } from "react";
import axios from "axios";
export default function useFetch(url, token){
    const [data,setData] = useState([])
    const [error,setError] = useState(null)
    const [loading,setLoading] = useState(false)

    useEffect(() => {
     
        (
            async function(){
                try{
                    setLoading(true)
                    const headers = {'Authorization': `Bearer ${token}`}
                    const response = await axios.get(url, {headers})

                    //parse the cast and crew data
                    const parsedData = response.data.movies_list.map((movie) => ({
                        ...movie,
                        crew: JSON.parse(movie.crew),
                        cast: JSON.parse(movie.cast),
                        }));
                       
                   
                    console.log('in usefetch hook, response is: ', parsedData)
                  
                    setData(parsedData)
                }catch(err){
                    setError(err)
                }finally{
                    setLoading(false)
                }
            }
        )()
     
  
    }, [url]);
   
    return { data, error, loading }

}