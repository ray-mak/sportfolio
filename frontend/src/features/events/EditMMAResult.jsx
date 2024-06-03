import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectMMAResultById } from "./mmaResultsApiSlice"

const EditMMAResult = () => {
    const { id } = useParams()


    const mmaResult = useSelector(state => selectMMAResultById(state, id))
    console.log(mmaResult)
    return (
        <div>EditMMAResult</div>
    )
}

export default EditMMAResult