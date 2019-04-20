import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Layout, Menu, Breadcrumb, PageHeader, Tabs, Input, Select, Button, Table, Divider, Tag } from 'antd';
const { Header, Content, Footer } = Layout;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const axios = require('axios');

function callback(key) {
  console.log(key);
}

class App extends Component {

  cardHistoryColumns = [{
    title: 'GameID',
    dataIndex: 'GameID',
    key: 'GameID',
    render: text => <a href="javascript:;">{text}</a>,
  }, {
    title: 'Team 1 Score',
    dataIndex: 'Team1_Score',
    key: 'Team1_Score',
  }, {
    title: 'Team 2 Score',
    dataIndex: 'Team2_Score',
    key: 'Team2_Score',
  },
  {
    title: 'Player Name',
    dataIndex: 'FIFA_Popular_Name',
    key: 'FIFA_Popular_Name',
  },{
    title: 'Card Color',
    dataIndex: 'Color_Card',
    key: 'Color_Card',
  }];

  startingLineupColumns = [{
    title: 'GameID',
    dataIndex: 'GameID',
    key: 'GameID',
    render: text => <a href="javascript:;">{text}</a>,
  },{
    title: 'Kit Number',
    dataIndex: 'PlayerID',
    key: 'PlayerID',
  },{
    title: 'Player Name',
    dataIndex: 'FIFA_Popular_Name',
    key: 'FIFA_Popular_Name',
  }];


  constructor(props) {
    super(props);
    this.state = {
      showStartingLineup: false,
      showCardHistory: false,
      cardHistoryTeam: "",
      cardHistoryColor: "",
      startingLineupTeam: "",
      startingLineup: [],
      cardHistory: []
    }
  }
  fetchStartingLineupData = (country) => {
    axios.get('http://localhost:3000/api/startingLineup?team=' + country)
      .then((response) => {
        this.setState({
          startingLineup: response.data.values
        })
      })
      .catch((error) => {
        console.log("OOF");
      })
  }
  fetchCardHistoryData = (country, card) => {
    console.log(country,card);
    axios.get('http://localhost:3000/api/cardHistory?team=' + this.state.cardHistoryTeam + '&color=' + card)
      .then((response) => {
        console.log(response.data.values);
        this.setState({
          cardHistory: response.data.values
        })
      })
      .catch((error) => {
        console.log("OOF");
      })
  }

  render() {
    return (
      <Layout className="layout">
        <Header style={{ backgroundColor: '#597ef7', textAlign: 'center' }}>
          <h1 style={{ color: '#fff' }}> FIFA World Cup Data Visualizer</h1>
        </Header>
        <Content style={{ padding: '20px 200px' }}>
          <Tabs defaultActiveKey="1" onChange={callback} style = {{color:'#597ef7'}}>
            <TabPane tab="Starting Lineup" key="1" >
              <div className="example-input">
                <Input size="large" placeholder="Team Name" onChange={(event) => this.setState({ startingLineupTeam: event.target.value })} />
                <Button style = {{backgroundColor : '#597ef7', color: 'white'}} icon="search" size="large" onClick= {(event) => this.fetchStartingLineupData(this.state.startingLineupTeam)}>Starting Lineup Query</Button>
                <Table columns={this.startingLineupColumns} dataSource={this.state.startingLineup} />
              </div>
            </TabPane>
            <TabPane tab="Card History" key="2">
              <div className="example-input">
                <Input size="large" placeholder="Team Name" onChange={(event) => this.setState({ cardHistoryTeam: event.target.value })} />
                <Select defaultValue="Card Color" size='large' style={{ padding: 10 }} onSelect = {(value) => this.setState({cardHistoryColor: value})}>
                  <Option value="Yellow">Yellow</Option>
                  <Option value="Red">Red</Option>
                </Select>
                <Button style = {{backgroundColor : '#597ef7', color: 'white'}} icon="search" size="large" onClick= {(event) => this.fetchCardHistoryData(this.state.cardHistoryTeam, this.state.cardHistoryColor)}>Card History Query</Button>
                <Table columns={this.cardHistoryColumns} dataSource={this.state.cardHistory} />
              </div>
            </TabPane>
          </Tabs>
        </Content>
        <Footer style={{ backgroundColor: '#597ef7', color: 'white', textAlign: 'center', marginTop:'130px'}}>
          Adarsh Yogesh Pai and James Brady
    </Footer>
      </Layout>
    );
  }
}

export default App;
