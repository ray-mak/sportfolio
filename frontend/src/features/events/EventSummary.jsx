import { useGetSingleEventMutation } from "./eventSummaryApiSlice"
import { useParams } from "react-router-dom"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const EventSummary = () => {
    const { id } = useParams()

    const navigate = useNavigate()

    const [getSingleEvent, {
        data,
        isLoading,
        isSuccess,
        isError,
        error
    }] = useGetSingleEventMutation()

    useEffect(() => {
        if (id) {
            getSingleEvent({ id })
        }
    }, [id, getSingleEvent])

    let content

    if (isLoading) content = <p>Loading...</p>
    if (isError) content = <p>{error?.data?.message}</p>

    if (isSuccess) {
        const matchupContainer = data.matchups.map(object => {
            const fighterA = object.matchup.split(" vs ")[0]
            const fighterB = object.matchup.split(" vs ")[1]
            const fighterAMLBets = object.mlBets.map(bet => {
                if (bet.pick === fighterA) {
                    return (
                        <p key={bet._id}><span onClick={() => navigate(`/${bet.user}`)} className="font-medium cursor-pointer text-blue-800 hover:text-blue-500">{bet.displayName}</span> {bet.betAmount}u @ {bet.odds.toFixed(2)}</p>
                    )
                }
            })
            const fighterBMLBets = object.mlBets.map(bet => {
                if (bet.pick !== fighterA) {
                    return (
                        <p key={bet._id} className="text-right"><span onClick={() => navigate(`/${bet.user}`)} className="font-medium cursor-pointer text-blue-800 hover:text-blue-500">{bet.displayName}</span> {bet.betAmount}u @ {bet.odds.toFixed(2)}</p>
                    )
                }
            })
            const fighterAProps = object.propBets.map(bet => {
                if (bet.propType === "fighterProp" && bet.pickFighter === fighterA) {
                    return (
                        <p key={bet._id}><span onClick={() => navigate(`/${bet.user}`)} className="font-medium cursor-pointer text-blue-800 hover:text-blue-500">{bet.displayName}</span> {bet.fighterProp} {bet.betAmount}u @ {bet.odds.toFixed(2)}</p>
                    )
                }
            })
            const fighterBProps = object.propBets.map(bet => {
                if (bet.propType === "fighterProp" && bet.pickFighter === fighterB) {
                    return (
                        <p key={bet._id} className="text-right"><span onClick={() => navigate(`/${bet.user}`)} className="font-medium cursor-pointer text-blue-800 hover:text-blue-500">{bet.displayName}</span> {bet.fighterProp} {bet.betAmount}u @ {bet.odds.toFixed(2)}</p>
                    )
                }
            })
            const fighterAParlays = object.parlays.map(bet => {
                return bet.parlayInfo.map(leg => {
                    let pick
                    if (leg.parlayBetType === "moneyline") {
                        pick = "straight pick"
                    } else if (leg.propType === "fighterProp") {
                        pick = leg.fighterProp
                    }
                    if ((leg.parlayBetType === "moneyline" || leg.propType === "fighterProp") && (leg.pick === fighterA || leg.pickFighter === fighterA)) {
                        return (
                            <p key={leg._id}><span onClick={() => navigate(`/${bet.user}`)} className="font-medium cursor-pointer text-blue-800 hover:text-blue-500">{bet.displayName}</span> {pick} @ {leg.odds.toFixed(2)}</p>
                        )
                    }
                })
            })
            const fighterBParlays = object.parlays.map(bet => {
                return bet.parlayInfo.map(leg => {
                    let pick
                    if (leg.parlayBetType === "moneyline") {
                        pick = "straight pick"
                    } else if (leg.propType === "fighterProp") {
                        pick = leg.fighterProp
                    }
                    if ((leg.parlayBetType === "moneyline" || leg.propType === "fighterProp") && (leg.pick === fighterB || leg.pickFighter === fighterB)) {
                        return (
                            <p key={leg._id} className="text-right"><span onClick={() => navigate(`/${bet.user}`)} className="font-medium cursor-pointer text-blue-800 hover:text-blue-500">{bet.displayName}</span> {pick} @ {leg.odds.toFixed(2)}</p>
                        )
                    }
                })
            })

            const timePropsSingles = object.propBets.map(bet => {
                if (bet.parlayBetType === "prop" && bet.propType === "timeProp") {
                    return (
                        <p key={bet._id} className="text-center"><span onClick={() => navigate(`/${bet.user}`)} className="font-medium cursor-pointer text-blue-800 hover:text-blue-500">{bet.displayName}</span> {bet.timeProp} @ {bet.odds}</p>
                    )
                }
            })
            const timePropsInParlays = object.parlays.map(bet => {
                return bet.parlayInfo.map(leg => {
                    if (leg.parlayBetType === "prop" && leg.propType === "timeProp") {
                        return (
                            <p key={bet._id} className="text-center"><span onClick={() => navigate(`/${bet.user}`)} className="font-medium cursor-pointer text-blue-800 hover:text-blue-500">{bet.displayName}</span> {leg.timeProp} @ {leg.odds}</p>
                        )
                    }
                })
            })

            return (
                <div key={object._id} className="bg-neutral-100 p-2 mb-4">
                    <h2 className="text-center font-medium text-base my-2">{object.matchup}</h2>
                    {(fighterAMLBets?.length > 0 || fighterBMLBets?.length > 0) && <div className="mb-4">
                        <p className="text-center font-medium">Moneyline Bets</p>
                        <div className="flex justify-between gap-2">
                            <div className="">
                                <p className="text-sm font-medium italic">{fighterA} moneyline bets</p>
                                {fighterAMLBets}
                            </div>
                            <div className="">
                                <p className="text-sm font-medium text-right italic">{fighterB} moneyline bets</p>
                                {fighterBMLBets}
                            </div>
                        </div>
                    </div>}
                    {(fighterAProps?.length > 0 || fighterBProps?.length > 0) && <div className="mb-4">
                        <p className="text-center font-medium">Fighter Props</p>
                        <div className="flex justify-between gap-2">
                            <div className="">
                                <p className="font-medium italic">{fighterA} prop bets</p>
                                {fighterAProps}
                            </div>
                            <div className="">
                                <p className="font-medium text-right italic">{fighterB} prop bets</p>
                                {fighterBProps}
                            </div>
                        </div>
                    </div>}
                    {(fighterAParlays?.length > 0 || fighterBParlays?.length > 0) && <div className="mb-4">
                        <p className="text-center font-medium">Parlays</p>
                        <div className="flex justify-between gap-2">
                            <div className="">
                                <p className="font-medium italic">Picking {fighterA} in a parlay</p>
                                {fighterAParlays}
                            </div>
                            <div className="">
                                <p className="font-medium text-right italic">Picking {fighterB} in a parlay</p>
                                {fighterBParlays}
                            </div>
                        </div>
                    </div>}
                    {(timePropsInParlays?.length > 0 || timePropsSingles?.length > 0) && <div>
                        <p className="font-medium text-center">Time props</p>
                        {timePropsSingles}
                        {timePropsInParlays}
                    </div>}
                </div>
            )
        })
        content = (
            <div className="flex justify-center text-sm">
                <div className="w-full p-4 bg-neutral-200 mt-4 sm:w-5/6 lg:w-3/4 xl:w-3/5 2xl:w-2/5">
                    <h1 className="text-xl font-semibold mb-4">{data.eventName} Betting Tips</h1>
                    {matchupContainer}
                </div>
            </div>
        )
    }

    console.log(data)
    return content
}

export default EventSummary