import { useState, useEffect } from "react"
import { useAddNewFighterMutation } from "./fightersApiSlice"

const NewFighterForm = () => {
    const [addNewFighter, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewFighterMutation()

    const [formData, setFormData] = useState({
        name: "",
        image: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }))
    }

    useEffect(() => {
        if (isSuccess) {
            setFormData({
                name: "",
                image: ""
            })
        }
    }, [isSuccess])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const dataToSubmit = {
            name: formData.name.trim(),
            image: formData.image.trim()
        }

        const canSubmit = Object.values(formData).every(Boolean)

        if (canSubmit) {
            await addNewFighter(dataToSubmit)
        }
    }

    return (
        <div className="flex justify-center">
            <form onSubmit={handleSubmit} className="mt-8 border-2 p-6 flex flex-col gap-4">
                <p className="text-lg font-medium">Add New Fighter Info</p>
                <label htmlFor="name">
                    <p className="text-sm">Fighter Name</p>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        onChange={handleChange}
                        value={formData.name}
                        className="py-1 px-2 rounded-lg border-lightGray border-2 md:px-4"
                    />
                </label>
                <label htmlFor="image">
                    <p className="text-sm">Image Link</p>
                    <input
                        id="image"
                        name="image"
                        type="text"
                        onChange={handleChange}
                        value={formData.image}
                        className="py-1 px-2 rounded-lg border-lightGray border-2 md:px-4"
                    />
                </label>
                <button className="w-full py-2 bg-green-600 text-white rounded-lg mt-4">
                    Add Fighter
                </button>
            </form>
        </div>
    )
}

export default NewFighterForm