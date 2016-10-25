RSpec.shared_examples 'user is not authorized' do |verb, action|
  it "#{action} redirects to login path when user is not authorized" do
    card = create(:card)

    send(verb, action, params: { deck_id: card.deck.id, id: card.id })
    expect(response).to have_http_status(302)
    expect(response).to redirect_to(login_path)
  end
end
