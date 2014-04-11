require 'spec_helper'

describe "Billing Events" do
  def stub_event(fixture_id, status = 200)
    stub_request(:get, "https://api.stripe.com/v1/events/#{fixture_id}").
        to_return(status: status, body: File.read("spec/support/fixtures/#{fixture_id}.json"))
  end

  describe "customer.created" do
    before do
      stub_event 'event_customer_created'
    end

    it "is successful" do
      post '/_billing_events', id: 'evt_customer_created'
      expect(response.code).to eq "200"

      # Additional expectations...
    end
  end
end