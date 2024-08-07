import { useGetSingleEventMutation } from "./eventSummaryApiSlice"
import { useParams } from "react-router-dom"
import { useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import ClipLoader from "react-spinners/ClipLoader"

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

    if (isLoading) content = (
        <div className="flex h-screen items-center justify-center">
            <div className="flex flex-col gap-4 items-center rounded-lg shadow-xl -mt-40 p-6">
                <ClipLoader
                    color="rgb(14 116 144)"
                    size={100}
                />
                <p>Loading</p>
            </div>
        </div>
    )

    if (isError) content = <p>{error?.data?.message}</p>

    if (isSuccess) {
        const matchupContainer = data.matchups.map(object => {
            const fighterA = object.matchup.split(" vs ")[0]
            const fighterB = object.matchup.split(" vs ")[1]
            let fighterAImg, fighterBImg
            if (object.fighterAImg === "") {
                fighterAImg = "https://banner2.cleanpng.com/lnd/20240425/ijw/aax06tbvd.webp"
            } else {
                fighterAImg = object.fighterAImg
            }

            if (object.fighterBImg === "") {
                fighterBImg = "https://banner2.cleanpng.com/lnd/20240425/ijw/aax06tbvd.webp"
            } else {
                fighterBImg = object.fighterBImg
            }
            const fighterAMLBets = object.mlBets.map(bet => {
                if (bet.pick === fighterA) {
                    return (
                        <p key={bet._id}>
                            <Link to={`/${bet.user}`} className="mr-1 font-medium text-blue-800 hover:text-blue-500">
                                {bet.displayName}
                            </Link>
                            {bet.betAmount}u @ {bet.odds.toFixed(2)}
                        </p>
                    )
                }
            })
            const fighterBMLBets = object.mlBets.map(bet => {
                if (bet.pick !== fighterA) {
                    return (
                        <p key={bet._id} className="text-right">
                            <Link to={`/${bet.user}`} className="mr-1 font-medium text-blue-800 hover:text-blue-500">
                                {bet.displayName}
                            </Link>
                            {bet.betAmount}u @ {bet.odds.toFixed(2)}
                        </p>
                    )
                }
            })
            const fighterAProps = object.propBets.map(bet => {
                if (bet.propType === "fighterProp" && bet.pickFighter === fighterA) {
                    return (
                        <p key={bet._id}>
                            <Link to={`/${bet.user}`} className="mr-1 font-medium text-blue-800 hover:text-blue-500">
                                {bet.displayName}
                            </Link>
                            {bet.fighterProp} {bet.betAmount}u @ {bet.odds.toFixed(2)}
                        </p>
                    )
                }
            })
            const fighterBProps = object.propBets.map(bet => {
                if (bet.propType === "fighterProp" && bet.pickFighter === fighterB) {
                    return (
                        <p key={bet._id} className="text-right">
                            <Link to={`/${bet.user}`} className="mr-1 font-medium text-blue-800 hover:text-blue-500">
                                {bet.displayName}
                            </Link>
                            {bet.fighterProp} {bet.betAmount}u @ {bet.odds.toFixed(2)}
                        </p>
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
                            <p key={leg._id}>
                                <Link to={`/${bet.user}`} className="mr-1 font-medium text-blue-800 hover:text-blue-500">
                                    {bet.displayName}
                                </Link>
                                {pick} @ {leg.odds.toFixed(2)}
                            </p>
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
                            <p key={leg._id} className="text-right">
                                <Link to={`/${bet.user}`} className="mr-1 font-medium text-blue-800 hover:text-blue-500">
                                    {bet.displayName}
                                </Link>
                                {pick} @ {leg.odds.toFixed(2)}
                            </p>
                        )
                    }
                })
            })

            const timePropsSingles = object.propBets.map(bet => {
                if (bet.parlayBetType === "prop" && bet.propType === "timeProp") {
                    return (
                        <p key={bet._id} className="text-center">
                            <Link to={`/${bet.user}`} className="mr-1 font-medium text-blue-800 hover:text-blue-500">
                                {bet.displayName}
                            </Link>
                            {bet.timeProp} @ {bet.odds}
                        </p>
                    )
                }
            })
            const timePropsInParlays = object.parlays.map(bet => {
                return bet.parlayInfo.map(leg => {
                    if (leg.parlayBetType === "prop" && leg.propType === "timeProp") {
                        return (
                            <p key={bet._id} className="text-center">
                                <Link to={`/${bet.user}`} className="mr-1 font-medium text-blue-800 hover:text-blue-500">
                                    {bet.displayName}
                                </Link>
                                {leg.timeProp} @ {leg.odds}
                            </p>
                        )
                    }
                })
            })

            return (
                <div key={object._id} className="border-2 border-slate-300 bg-white p-4">
                    <div className="flex justify-between gap-2">
                        <div className="w-20 h-20 overflow-hidden rounded md:w-28 md:h-28">
                            <img className="w-full object-fill" src={fighterAImg} />
                        </div>
                        <h2 className="text-center font-medium text-sm my-2 md:text-base">{object.matchup}</h2>
                        <div className="w-20 h-20 overflow-hidden rounded md:w-28 md:h-28">
                            <img className="w-full object-fill" src={fighterBImg} />
                        </div>
                    </div>
                    {(fighterAMLBets?.length > 0 || fighterBMLBets?.length > 0) && <div>
                        <p className="text-center font-medium text-sm">Moneyline Bets</p>
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
                <div className="w-full bg-slate-100 mt-4 sm:w-5/6 lg:w-3/4 xl:w-3/5 2xl:w-2/5">
                    <h1 className="p-2 text-xl font-semibold text-white bg-cyan-700">{data.eventName} Betting Tips</h1>
                    <div className="p-2 flex flex-col gap-4 md:p-6">
                        {matchupContainer}
                    </div>
                </div>
            </div>
        )
    }

    return content
}

export default EventSummary