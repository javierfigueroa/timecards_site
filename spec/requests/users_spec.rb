require 'spec_helper'

describe "Users" do
  before(:each) do
    @attr = {
        :first_name => "Example User",
        :email => "figueroa7@gmail.com",
        :password => "changeme",
        :password_confirmation => "changeme"
    }
  end

  #stripe webhooks
  def stub_event(fixture_id, status = 200)
    stub_request(:get, "https://api.stripe.com/v1/events/#{fixture_id}").
        to_return(status: status, body: File.read("spec/support/fixtures/#{fixture_id}.json"))
  end

  describe "customer.created" do
    before do
      #stub_event 'event_customer_created'
    end

    it "is successful" do
      post '/stripe', id: 'event_customer_created'
      expect(response.code).to eq "200"

      # Additional expectations...
    end
  end

  describe "customer.subscription.trial_will_end" do
    before do
      #stub_event 'customer.subscription.trial_will_end'
    end

    it "is successful" do
      #User.create!(@attr)
      post '/stripe', id: 'customer.subscription.trial_will_end'
      expect(response.code).to eq "200"

      # Additional expectations...
    end
  end
end
