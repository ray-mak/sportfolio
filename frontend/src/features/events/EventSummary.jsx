import { useGetSingleEventMutation } from "./eventSummaryApiSlice"
import { useParams } from "react-router-dom"
import { useEffect } from "react"

const EventSummary = () => {
    const { id } = useParams()
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
                        <p>{bet.displayName} {bet.betAmount}u @ {bet.odds}</p>
                    )
                }
            })
            const fighterBMLBets = object.mlBets.map(bet => {
                if (bet.pick !== fighterA) {
                    return (
                        <p>{bet.displayName} {bet.betAmount}u @ {bet.odds}</p>
                    )
                }
            })
            const fighterAProps = object.propBets.map(bet => {
                if (bet.propType === "fighterProp" && bet.pickFighter === fighterA) {
                    return (
                        <p>{bet.displayName} {bet.fighterProp} {bet.betAmount}u @ {bet.odds}</p>
                    )
                }
            })
            const fighterBProps = object.propBets.map(bet => {
                if (bet.propType === "fighterProp" && bet.pickFighter === fighterB) {
                    return (
                        <p>{bet.displayName} {bet.fighterProp} {bet.betAmount}u @ {bet.odds}</p>
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
                            <p>{bet.displayName} {pick} @ {leg.odds}</p>
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
                            <p>{bet.displayName} {pick} @ {leg.odds}</p>
                        )
                    }
                })
            })
            const timeProps = object.parlays.map(bet => {
                return bet.parlayInfo.map(leg => {
                    if (leg.parlayBetType === "prop" && leg.propType === "timeProp") {
                        return (
                            <p>{bet.displayName} {leg.timeProp} @ {leg.odds}</p>
                        )
                    }
                })
            })

            return (
                <div key={object._id} className="border-2 border-red-500">
                    <h2>{object.matchup}</h2>
                    <div className="flex">
                        <div className="border-2 border-slate-500">
                            <p>{fighterA} moneyline bets</p>
                            {fighterAMLBets}
                        </div>
                        <div className="border-2 border-slate-500">
                            <p>{fighterB} moneyline bets</p>
                            {fighterBMLBets}
                        </div>
                    </div>
                    <div>
                        <p>Props</p>
                        <div className="flex">
                            <div className="border-2 border-slate-500">
                                <p>{fighterA} prop bets</p>
                                {fighterAProps}
                            </div>
                            <div className="border-2 border-slate-500">
                                <p>{fighterB} prop bets</p>
                                {fighterBProps}
                            </div>
                        </div>
                    </div>
                    <div>
                        <p>Parlays</p>
                        <div className="flex">
                            <div className="border-2 border-slate-500">
                                <p>Picking {fighterA} in a parlay</p>
                                {fighterAParlays}
                            </div>
                            <div className="border-2 border-slate-500">
                                <p>Picking {fighterB} in a parlay</p>
                                {fighterBParlays}
                            </div>
                        </div>
                    </div>
                    <div>
                        <p>Time props</p>
                        {timeProps}
                    </div>
                </div>
            )
        })
        content = (
            <div className="flex justify-center">
                <div>
                    <h1 className="text-lg font-semibold">{data.eventName} Betting Tips</h1>
                    {matchupContainer}
                </div>
            </div>
        )
    }

    console.log(data)
    return content
}

export default EventSummary