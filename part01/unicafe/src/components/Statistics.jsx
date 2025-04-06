import StatisticLine from "./StatisticLine"

const Statistics = ({header, good, neutral, bad}) => {
    return (
    <table>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="all" value={good + neutral + bad} />
        <StatisticLine text="average" value={((good * 1)+ (neutral * 0) + (bad * -1)) / (good + neutral + bad)} />
        <StatisticLine text="positive" value={`${(good / (good + neutral + bad)) * 100}%`} />
    </table>)
}

export default Statistics;