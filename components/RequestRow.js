import React, { Component } from "react";
import { Table, Button } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import Campaign from "../ethereum/campaign";

class RequestRow extends Component {
  onApprove = async () => {
    // instance of Campaign contract
    const campaign = Campaign(this.props.address);
    const accounts = await web3.eth.getAccounts();
    //approve request method
    await campaign.methods.approveRequest(this.props.id).send({
      from: accounts[0],
    });
  };

  onFinalize = async () => {
    //create contract instance
    const campaign = Campaign(this.props.address);
    //get accounts
    const accounts = await web3.eth.getAccounts();
    //finalize method
    await campaign.methods.finaliseRequest(this.props.id).send({
      from: accounts[0],
    });
  };

  render() {
    // from semantic-ui for table
    const { Row, Cell } = Table;
    //props passed from request index.js
    const { id, request, approversCount } = this.props;
    //after more than 50% approvals finalize
    const readyToFinalize = request.approvalCount > approversCount / 2;
    return (
      <Row
        disabled={request.complete}
        positive={readyToFinalize && !request.complete}
      >
        <Cell>{id}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{web3.utils.fromWei(request.value, "ether")}</Cell>
        <Cell>{request.recipient}</Cell>
        <Cell>
          {request.approvalCount} / {approversCount}
        </Cell>
        <Cell>
          {request.complete ? (
            "Completed"
          ) : (
            <Button color="green" basic onClick={this.onApprove}>
              Approve
            </Button>
          )}
        </Cell>
        <Cell>
          {request.complete ? (
            "Done"
          ) : (
            <Button color="red" basic onClick={this.onFinalize}>
              Finalize
            </Button>
          )}
        </Cell>
      </Row>
    );
  }
}

export default RequestRow;
