import React, { Component } from "react";
import { Form, Button, Input, Message } from "semantic-ui-react";

import Layout from "../../components/layout";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import { Router } from "../../routes";

class CampaignNew extends Component {
  // State Variable
  state = {
    minimumContribution: "",
    errormMessage: "",
    loading: false,
  };

  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({ loading: true, errormMessage: "" });

    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods
        .createCampaign(this.state.minimumContribution)
        .send({
          from: accounts[0],
        });
      //after creation of campaign contract call routes
      // With route URL
      Router.pushRoute("/"); //navigate to index page
    } catch (error) {
      this.setState({ errormMessage: error.message });
    }

    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <h3>Create a New Campaign</h3>
        {/* create Campaign form */}
        <Form onSubmit={this.onSubmit} error={this.state.errormMessage}>
          <Form.Field>
            <label>Minimum Contribution</label>
            <Input
              label="Wei"
              labelPosition="right"
              value={this.state.minimumContribution}
              onChange={(e) =>
                this.setState({ minimumContribution: e.target.value })
              }
            />
          </Form.Field>

          {/* error msg */}
          <Message error header="Oops!" content={this.state.errormMessage} />

          {/* Semantic-Ui button has builtin loading attribute */}
          <Button type="submit" primary loading={this.state.loading}>
            Create
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default CampaignNew;
