import { useState, useCallback } from "react";

export  const useCopyToClipboard = () => {
    const [isCopied, setIsCopied] = useState(false)

    const copy = useCallback((text) => {
        if(navigator.clipboard && window.isSecureContext){
            navigator.clipboard.writeText(text)
            .then(()=>{
                console.log("Copied")
                setIsCopied(true)
                setTimeout(() => setIsCopied(false), 2000)
            })
            .catch((err)=>{
                console.log("Copy failed:",err)
                setIsCopied(false)
            })
        }else{
            const textArea = document.createElement("textarea")
            textArea.value = text
            textArea.style.position = "fixed"
            textArea.style.opacity = 0
            document.body.appendChild(textArea)
            textArea.focus()
            textArea.select()
                
            try{
                const success = document.execCommand("copy")
                success ? console.log("Copied") : console.log("Copy command failed")
                setIsCopied(success)
                setTimeout(() => setIsCopied(false), 2000)
            }catch(err){
                console.log("Copy failed:", err)
                setIsCopied(false)
            }finally{
                document.body.removeChild(textArea)
            }

        }
    },[])

    return [isCopied, copy]
}