import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {

  const [searchText, setSearchText] = useState("");
  const [playerData, setPlayerData] = useState({});
  const [tier, setTier] = useState("");
  const [result3, setResult3] = useState("");
  const [isData, setIsData] = useState(false);
  const API_KEY = 'RGAPI-7f5cf09c-cea9-45fc-a80a-944fe0ae4a5c'
  
  async function searchForPlayer() {
    var APIcallString = "https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/"+searchText+"?api_key="+API_KEY
    
    try {
      const result = await axios.get(APIcallString)
      setPlayerData(result.data)
      const playerId = result.data.id
      // console.log(result.data)
      const result2 = await axios.get(`https://kr.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${playerId}/top?api_key=${API_KEY}`)
      // console.log(result2)
      const networkresult3 = await axios.get(`https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${playerId}?api_key=${API_KEY}`)
      // console.log(networkresult3)
      setResult3(networkresult3);
      setIsData(true);
      // console.log(result3.data[0].tier);
      // const tier1 = result3.data[0].tier
      // console.log(result3.data[0].leaguePoints);
      // setTier(`${result3.data[0].tier} ${result3.data[0].leaguePoints}점`)
      // console.log(`${result3.data[0].tier} ${result3.data[0].leaguePoints}점`)
      // const tier = result3.data[0].tier
      // const LP = result3.data[0].leaguePoints
      // const wins = result3.data[0].wins <- 이렇게 변수를 저장해서 wins+losses 를 구해서 전으로 뽑아준다.
      // console.log(`${result3.data[0].wins+result3.data[0].losses}전 ${result3.data[0].wins}승 ${result3.data[0].losses}패`)
      const puuid = result.data.puuid
      const matches = await axios.get(`https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids??start=0&count=20&api_key=${API_KEY}`)
      const matchId = matches.data
      const matchLog = [];
      for (let i = 0; i<matches.data.length; i++ ) {
        matchLog.push(await axios.get(`https://asia.api.riotgames.com/lol/match/v5/matches/${matchId[i]}?api_key=${API_KEY}`))
      }
      console.log(matchLog)
      // const matchLog = await axios.get(`https://asia.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${API_KEY}`)

    } catch (error) {
      console.log(error);
    }
  }
  
  return (
    <div className="App">
    <div className='container'>
      <h1>그.님.티?</h1>
      <input type='text' onChange={e => setSearchText(e.target.value)}></input>
      <button onClick={searchForPlayer}>검색</button>
    </div>
    {JSON.stringify(playerData) != '{}' ?
    <>
      <p>{playerData.name}</p>
      <p>소환사 레벨 몇인데? {playerData.summonerLevel}</p>
      <p>너 티어 어딘데?</p>
      {(isData === true && result3.data.length === 1 && result3.data[0].queueType === 'RANKED_SOLO_5x5') ? (
        <p>{`${result3.data[0].tier} ${result3.data[0].rank} ${result3.data[0].leaguePoints}점`} ({result3.data[0].wins+result3.data[0].losses}전 {result3.data[0].wins}승 {result3.data[0].losses}패)</p>
      ) : (
        <p>unranked</p>
      )}
      <p>{tier}</p>
  
    </>
    : <><p>no player data</p></>
  }
    </div>
      );
}

export default App;