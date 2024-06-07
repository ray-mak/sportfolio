import { useState } from "react"

const UserStatsSummary = ({ data }) => {
    return (
        <div>
            <div>
                <p className="text-xl font-semibold">{data.displayName}</p>
                <div className="flex w-40 h-44 border-2">

                </div>
                <div>

                </div>
            </div>
        </div>
    )
}

export default UserStatsSummary