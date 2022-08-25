//SPDX-License-identifier: GPL-3.0

pragma solidity ^0.4.17;

//factory contract to create and deploy multiple Campaign contracts
contract CampaignFactory {
    // lists all the deployed contracts
    address[] public deployedCampaigns;

    //function to create new instance of campaign contract
    function createCampaign(uint256 _minimumContribution) public {
        // pass the campaign constructor arguments and create new instance of campaign contract.
        // the manager who deploys the contract will be CampaignFactory contract address.
        // So to prevent that  pass the user who deployed CampaignFactory, as argument to Campaign contract.
        address newCampaign = new Campaign(_minimumContribution, msg.sender); //gives the address of new contract.
        deployedCampaigns.push(newCampaign);
    }

    //to get all the deployed campaigns
    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
}

contract Campaign {
    // Request structure
    struct Request {
        string description;
        uint256 value;
        address recipient;
        bool complete;
        uint256 approvalCount;
        mapping(address => bool) approvals;
    }
    // list of requests
    Request[] public requests;

    address public manager;
    uint256 public minimumContribution;
    // address[] public approvers; //array takes more gas fee
    //so use mapping type
    mapping(address => bool) public approvers;
    //number of contributors/approvers
    // because we cannot iterate over mapping type approvers.
    uint256 public approversCount;

    // restrict only to manager
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    constructor(uint256 _minimumContribution, address creator) public {
        // manager = msg.sender; //who deploy the contract
        // since we deploy using CampaignFactory contract it will be manager
        // so to avoid that, we are getting user who called CampaignFactory contract as argument.
        manager = creator;
        minimumContribution = _minimumContribution; //minimum amount per contribution. Given during contract deployment.
    }

    function contribute() public payable {
        //check the minimum contribution condition
        require(msg.value >= minimumContribution);
        // add to approvers list after contribution
        // approvers.push(msg.sender);
        approvers[msg.sender] = true; //approver added to map
        //increase approvers count
        approversCount++;
    }

    function createRequest(
        string _description,
        uint256 _value,
        address _recipient
    ) public restricted {
        // storage vs memory
        // both sometimes 'references where our contract stores data'.
        // storage stores data as call by reference i.e both var reference same memory location and changes the value of parent.
        // memory stores data as call by value i.e create copy of the parent var and doesn't change parent value.
        // storage and memory also references 'how our solidity var stores value'
        // i.e storage is permanent and global.
        //memory is temporary until the func executes.
        //create new request from Request struct object
        Request memory newrequest = Request({
            description: _description,
            value: _value,
            recipient: _recipient,
            complete: false,
            approvalCount: 0
        });
        // add to requests list
        requests.push(newrequest);
    }

    //approve the specific request from list
    function approveRequest(uint256 index) public {
        // parthicular request from requests list.
        // must change the Request value permanently and also change parent value, so 'storage' type.
        Request storage request = requests[index];
        // only contributor can approve
        require(approvers[msg.sender]); //user must be a contributor.
        //each contributor can give only one vote
        require(!request.approvals[msg.sender]); //if already approved than approvals is true.
        // after passing both require conditions
        request.approvals[msg.sender] = true; // approval is done by user
        request.approvalCount++; //increase the count
    }

    //finalise the request
    function finaliseRequest(uint256 index) public {
        Request storage request = requests[index];
        // check if request is already completed
        require(!request.complete);
        // check if more than 50% have voted/approved
        require(request.approvalCount > (approversCount / 2));
        // then finalise
        request.recipient.transfer(request.value); //transfer the amount to recipient.
        request.complete = true;
    }

    //summary of the contract get minimum Contribution, balance, number of requests, number of contributors, address of manager.
    function getSummary()
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            address
        )
    {
        return (
            minimumContribution,
            this.balance,
            requests.length,
            approversCount,
            manager
        );
    }

    // get counts of request
    function getRequestsCount() public view returns (uint256) {
        return requests.length;
    }
}
