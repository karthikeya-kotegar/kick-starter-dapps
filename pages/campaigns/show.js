import React, { Component } from "react";
import { Card, Grid, Button } from "semantic-ui-react";
import Layout from "../../components/Layout";
import Campaign from "../../ethereum/campaign";
import web3 from "../../ethereum/web3";
import ContributeForm from "../../components/ContributeForm";
import { Link } from "../../routes";

class CampaignShow extends Component {
  static async getInitialProps(props) {
    // get the contract address from route param
    // console.log("address query", props.query.address);
    //instance of Campaign contract for particular contract address
    const campaign = Campaign(props.query.address);
    // get the summary of particular contract from contract method.
    const summary = await campaign.methods.getSummary().call();
    // console.log("Summary", summary);
    //returns data as props
    return {
      contractAddress: props.query.address, // to pass as props to ContributeForm component
      minimumContribution: summary[0],
      balance: summary[1],
      requestCount: summary[2],
      approversCount: summary[3],
      manager: summary[4],
    };
  }

  // create a semantic-UI cards
  renderCards() {
    // get data from getInitialProps
    const {
      minimumContribution,
      balance,
      requestCount,
      approversCount,
      manager,
    } = this.props;

    const items = [
      {
        header: manager,
        meta: "Address of Manager",
        description:
          "The manager created this campaign and can create request to withdraw money.",
        style: { overflowWrap: "break-word" },
      },
      {
        header: minimumContribution,
        meta: "Minimum Contribution in Wei",
        description:
          "You must contribute atleast this much wei to become an approver.",
      },
      {
        header: requestCount,
        meta: "Number of Requests",
        description:
          "Manager requests to withdraw money from the contract. Requests must be approved by approvers.",
      },
      {
        header: approversCount,
        meta: "Number of Contributors",
        description:
          "Number of people who have already donated to this camapaign. ",
      },
      {
        header: web3.utils.fromWei(balance, "ether"),
        meta: "Campaign balance in Ether",
        description: "How much money this campaign has left to spend",
      },
    ];

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <h3>Campaign details</h3>
        <Grid>
          {/* <Grid.row> */}
          {/* cards */}
          <Grid.Column width={10}>{this.renderCards()}</Grid.Column>
          {/* form */}
          <Grid.Column width={6}>
            <ContributeForm address={this.props.contractAddress} />
          </Grid.Column>
          {/* </Grid.row> */}

          <Grid.Row>
            <Grid.Column>
              {/* view request button */}
              <Link route={`/campaigns/${this.props.contractAddress}/requests`}>
                <a>
                  <Button primary>View Requests</Button>
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default CampaignShow;
