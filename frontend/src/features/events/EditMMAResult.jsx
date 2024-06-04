import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectMMAResultById } from "./mmaResultsApiSlice"
import EditMMAResultForm from "./EditMMAResultForm"

//may need to add usePersis, otherwise it unsubscribes after 1 minute
const EditMMAResult = () => {
    const { id } = useParams()


    const mmaResult = useSelector(state => selectMMAResultById(state, id))
    console.log(mmaResult)

    const content = mmaResult ? <EditMMAResultForm mmaResult={mmaResult} /> : <p>Loading...</p>
    return content
}

export default EditMMAResult