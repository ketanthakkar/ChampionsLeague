import React from 'react';  
import './App.css';
import {teams} from './team';

const App = () => {

  let groups = [];
  let groupScores = [];
  let top16 = [];
  let round16Winner = [];
  let quarterFinalWinner = [];
  
  const createGroup = () => {
    let temp = [];
    let group = {};
    let count = 0;

    teams.forEach(team => {

      if(count === 4) {
        groups.push(group);
        group = {};
        count = 0;

        if(temp.length > 0) {
          temp.forEach((ele, index) => {

            if(temp.countryCode in group) {
              return;
            }

            group[ele.countryCode] = ele.name; 
            temp.shift();
            count += 1;
          })
        }
      }

      if(team.countryCode in group) {
        temp.push(team);
        return;
      }
      group[team.countryCode] = team.name;
      count += 1;
    }) 

    groups.push(group);
  }

  const renderGroupStageDraw = () => {
  
    createGroup();

    return groups.map((ele, index) => {
        return(
          <div className="group">
            <h4>{`Group${index+1}`}</h4> 
            {
              Object.keys(ele).map(key => (
                <div> {`${ele[key]}-${key}`} </div>
              ))
            }
          </div>
        )
    })

  }

  const generateRandom = () => {
    return Math.floor((Math.random() * 15))
  }

  const renderGroupStageResult = () => {

    let data = [];
    
    groups.map((groupObj, index) => {
            
      data.push(<h4>{`Group${index+1}`}</h4>)

      let obj = {};
      for(let key in groupObj) {

        let keys = Object.keys(groupObj);
        
        for(let i=0;i<keys.length;i++) {
          
          if(groupObj[key] !== groupObj[keys[i]]) {

            let score1 = generateRandom();
            let score2 = generateRandom();

            if(score1 > score2) {
              obj[`${groupObj[key]}-${key}`] = obj[`${groupObj[key]}-${key}`]+3 || 3;
            } else if(score1 < score2) {
              obj[`${groupObj[keys[i]]}-${keys[i]}`] = obj[`${groupObj[keys[i]]}-${keys[i]}`]+3 || 3;
            } else {
              obj[`${groupObj[key]}-${key}`] = obj[`${groupObj[key]}-${key}`]+1 || 1;
              obj[`${groupObj[keys[i]]}-${keys[i]}`] = obj[`${groupObj[keys[i]]}-${keys[i]}`]+1 || 1;
            }

            data.push(<div>{`${groupObj[key]}-${groupObj[keys[i]]}`} {score1+':'+score2}</div>);
          }
        }
      }

      groupScores.push(obj);
    })

    return <section>{data}</section>;
  }


  const renderGroupStageTable = () => {

    let data = [];
    let result = [];

    groupScores.map((team, index) => {
      
      data.push(<h4>{`Group${index+1}`}</h4>)

      let sorted = Object.entries(team).sort((a,b)=> b[1]-a[1])

      for(let key in sorted) {
        let rank = Number(key)+1;
        data.push(<div>{`${rank} ${sorted[key]}`}</div>)
      }

      result.push(<div className="score-data">{data.splice(0)}</div>);
    })
        
    return result;
  }

  const renderLast16Draw = () => {

    let top16Draw = [];
    
    groupScores.map(team => {
      
      let sorted = Object.entries(team).sort((a,b)=> b[1]-a[1])

      let obj = {};

      let i = 1;
      for(let key in sorted) {
        if(i <= 2) { 
          i === 1 ? obj["winner"] = sorted[key][0] : obj["runners"] = sorted[key][0] ;
          i++;
        }
      }
      top16.push(obj);
    })

    let keys = Object.keys(top16);
        
    for(let i=0;i<keys.length;i++) {

      if(i === keys.length-1) {
        top16Draw.push(<div>{`${top16[keys[i]]["winner"]} -vs- ${top16[keys[0]]["runners"]}`}</div>);
      } else {
        top16Draw.push(<div>{`${top16[keys[i]]["winner"]} -vs- ${top16[keys[i+1]]["runners"]}`}</div>);
      }
     
    }
        
    return <section className="top16-draw">{top16Draw}</section>;
  }

  const renderLast16Result = () => {

    let top16Result = [];

    let keys = Object.keys(top16);
        
    for(let i=0;i<keys.length;i++) {

      let round1Score1 = generateRandom();
      let round1Score2 = generateRandom();
      let round2Score1 = generateRandom();
      let round2Score2 = generateRandom();

      let tempObj = {};

      if(round1Score1+round2Score1 > round1Score2+round2Score2) {
        tempObj[`${top16[keys[i]]["winner"]}`] = round1Score1+round2Score1;
      } else if(round1Score1+round2Score1 < round1Score2+round2Score2) {
        if(i === keys.length-1) {
          tempObj[`${top16[keys[0]]["runners"]}`] = round1Score2+round2Score2;
        } else {
          tempObj[`${top16[keys[i+1]]["runners"]}`] = round1Score2+round2Score2;
        }
      } else {
        if(round2Score2 > round1Score1) {
          if(i === keys.length-1) {
            tempObj[`${top16[keys[0]]["runners"]}`] = round1Score2+round2Score2;
          } else {
            tempObj[`${top16[keys[i+1]]["runners"]}`] = round1Score2+round2Score2;
          }
        } else {
          tempObj[`${top16[keys[i]]["winner"]}`] = round1Score1+round2Score1;
        }
        console.log("Extra condition need to be check as it is tie condition");
      }

      if(i === keys.length-1) {
        top16Result.push(<div>{`${top16[keys[i]]["winner"]} -vs- ${top16[keys[0]]["runners"]} ${round1Score1 + ':' + round1Score2} ${round2Score1 + ':' + round2Score2}`}</div>);
      } else {
        top16Result.push(<div>{`${top16[keys[i]]["winner"]} -vs- ${top16[keys[i+1]]["runners"]} ${round1Score1 + ':' + round1Score2} ${round2Score1 + ':' + round2Score2}`}</div>);
      }

      round16Winner.push(tempObj);
    }
        
    return <section className="top16-draw">{top16Result}</section>;
  }

  const renderQuarterDraw = () => {

    let quaterDraw = [];
    let firstTeam;

    round16Winner.map((team, index) => {
      
      if(index%2 !== 0) {
        quaterDraw.push(<div>{`${firstTeam} -vs- ${Object.keys(team)[0]}`}</div>);
      }

      firstTeam = Object.keys(team)[0];
    });
        
    return <section className="top16-draw">{quaterDraw}</section>;
  }

  const renderQuarterResults = () => {

    let quaterDraw = [];
    let firstTeam;

    round16Winner.map((team, index) => {
      
      if(index%2 !== 0) {

        let round1Score1 = generateRandom();
        let round1Score2 = generateRandom();
        let round2Score1 = generateRandom();
        let round2Score2 = generateRandom();

      let tempObj = {};

      if(round1Score1+round2Score1 > round1Score2+round2Score2) {
        tempObj[`${firstTeam}`] = round1Score1+round2Score1;
      } else if(round1Score1+round2Score1 < round1Score2+round2Score2) {
        tempObj[`${Object.keys(team)[0]}`] = round1Score2+round2Score2;
      } else {
        if(round2Score2 > round1Score1) {
          tempObj[`${Object.keys(team)[0]}`] = round1Score2+round2Score2;
        } else {
          tempObj[`${firstTeam}`] = round1Score1+round2Score1;
        }
        console.log("Extra condition need to be check as it is tie condition");
      }

      quarterFinalWinner.push(tempObj);

      quaterDraw.push(<div>{`${firstTeam} -vs- ${Object.keys(team)[0]} ${round1Score1 + ':' + round1Score2} ${round2Score1 + ':' + round2Score2}`}</div>);
      }

      firstTeam = Object.keys(team)[0];
    });

    return <section className="top16-draw">{quaterDraw}</section>;
  }

  const renderSemifinalDraw = () => {

    let semifinalDraw = [];
    let firstTeam;

    quarterFinalWinner.map((team, index) => {
      
      if(index%2 !== 0) {
        semifinalDraw.push(<div>{`${firstTeam} -vs- ${Object.keys(team)[0]}`}</div>);
      }

      firstTeam = Object.keys(team)[0];
    });
        
    return <section className="top16-draw">{semifinalDraw}</section>;
  }

  return (
    <div className="App">
      <h3>****** Group Stage Draw ******</h3>
      <div className="groups">
        {renderGroupStageDraw()}
      </div>
      <h3>****** Group Stage Results ******</h3>
      <div className="groups">
        {renderGroupStageResult()}
      </div>
      <h3>******** Group Stage Tables *********</h3>
      <div className="groups">
        {renderGroupStageTable()}
      </div>
      <h3>******** Last 16 Draw *********</h3>
      <div className="groups">
        {renderLast16Draw()}
      </div>
      <h3>******** Last 16 Results *********</h3>
      <div className="groups">
        {renderLast16Result()}
      </div>
      <h3>******** Quarter Final Draw *********</h3>
      <div className="groups">
        {renderQuarterDraw()}
      </div>      
      <h3>******** Quarter Final Results *********</h3>
      <div className="groups">
        {renderQuarterResults()}
      </div>
      <h3>******** Semifinal Draw *********</h3>
      <div className="groups">
        {renderSemifinalDraw()}
      </div> 
    </div>
  );
}


export default App;
