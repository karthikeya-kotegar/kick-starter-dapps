import React, { Component } from "react";
import { Card, Button } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import factory from "../ethereum/factory";
import Layout from "../components/layout";
import { Link } from "../routes";

//we are using Next.js framework.
// next.js is server side rendering i.e next server will convert JSX code to HTML.
// React is client side rendering i.e browser will take JS and convert to HTML.
class CampaignIndex extends Component {
  // componentDidMount func will not be called in Next.js because of server side rendering.
  // async componentDidMount() {
  //   const campaigns = await factory.methods.getDeployedCampaigns().call();

  //   console.log("deployed contract: ", campaigns);
  // }
  // so to get the initial data before rendering Next.js use getInitialProps() func.
  // it gets the data and then render page from server as props.
  static async getInitialProps() {
    const campaigns = await factory.methods.getDeployedCampaigns().call();
    return { campaigns };
  }

  renderCampaigns() {
    const items = this.props.campaigns.map((address) => {
      return {
        header: address,
        description: (
          <Link route={`/campaigns/${address}`}>
            <a>View Campaign</a>
          </Link>
        ),
        fluid: true,
        style: { overflowWrap: "break-word" },
      };
    });

    //semantic-UI cards
    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <div>
          <h3>Open Campaigns</h3>

          <Link route="/campaigns/new">
            <a>
              {/* button */}
              <Button
                floated="right"
                content="Create Campaign"
                icon="add circle"
                primary
              />
            </a>
          </Link>

          {/* cards */}
          {this.renderCampaigns()}
        </div>
      </Layout>
    );
  }
}

export default CampaignIndex;
