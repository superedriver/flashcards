require "rails_helper"

describe "delete_cards", js: true, type: :feature do
# describe "delete_cards", type: :feature do

  subject { page }

  let(:delete_button) { I18n.t("buttons.delete") }
  let(:login_button) { I18n.t("buttons.login") }

  let(:card1_original_text) { "card1_original_text" }
  let(:card1_translated_text) { "card1_translated_text" }
  let(:card2_original_text) { "card2_original_text" }
  let(:card2_translated_text) { "card2_translated_text" }
  let(:card3_original_text) { "card3_original_text" }
  let(:card3_translated_text) { "card3_translated_text" }

  let(:user) { create(:user) }
  # let(:card1) { create(:card,
  #                      original_text: card1_original_text,
  #                      translated_text: card1_translated_text,
  #                      user_id: user.id) }
  # let(:card2) { create(:card,
  #                      original_text: card2_original_text,
  #                      translated_text: card2_translated_text,
  #                      user_id: user.id) }


  before do
    visit login_path
    fill_in :email, with: user.email
    fill_in :password, with: "qwerty"
    click_button login_button
  end

  # describe "delete from show_card_path" do
  #   describe "dismiss_confirm" do
  #     before do
  #       visit card_path(card1)
  #       dismiss_confirm do
  #         click_link delete_button
  #       end
  #     end
  #
  #     it { should have_current_path card_path(card1) }
  #     it { should have_content card1_original_text }
  #     it { should have_content card1_translated_text }
  #   end
  #
  #   describe "accept_confirm" do
  #     before do
  #       visit card_path(card1)
  #       accept_confirm do
  #         click_link delete_button
  #       end
  #     end
  #
  #     it { should have_current_path cards_path }
  #     it { should have_content "Modification" }
  #     it { should_not have_content card1_original_text }
  #     it { should_not have_content card1_translated_text }
  #   end
  # end

  # describe "delete from edit_card_path" do
  #   describe "dismiss_confirm" do
  #     before do
  #       visit edit_card_path(card2)
  #       dismiss_confirm do
  #         click_link delete_button
  #       end
  #     end
  #
  #     it { should have_current_path edit_card_path(card2) }
  #     it { should have_content "Редактирование карты" }
  #   end
  #
  #   describe "accept_confirm" do
  #     before do
  #       visit edit_card_path(card2)
  #       accept_confirm do
  #         click_link delete_button
  #       end
  #     end
  #
  #     it { should have_current_path cards_path }
  #     it { should have_content "Modification" }
  #     it { should_not have_content card2_original_text }
  #     it { should_not have_content card2_translated_text }
  #   end
  # end

  describe "delete from cards_path" do
    before do
      @card3 = create(:card, original_text: card3_original_text,
                      translated_text: card3_translated_text,
                      user_id: user.id)
    end

    describe "dismiss_confirm" do
      before do
        visit cards_path
        dismiss_confirm do
          click_link delete_button
        end
      end

      it { should have_current_path cards_path }
      it { should have_content card3_original_text }
      it { should have_content card3_translated_text }
    end

    describe "accept_confirm" do
      before do
        visit cards_path
        accept_confirm do
          click_link delete_button
        end
      end

      it { should have_current_path cards_path }
      it { should_not have_content card3_original_text }
      it { should_not have_content card3_translated_text }
    end
  end
end