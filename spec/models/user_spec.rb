require "rails_helper"

RSpec.describe User, type: :model do

  before do
    @user = FactoryGirl.create(:user)
  end

  subject { @user }

  it { should respond_to(:email) }
  it { should respond_to(:password) }
  it { should respond_to(:created_at) }
  it { should respond_to(:updated_at) }
  it { should respond_to(:crypted_password) }
  it { should respond_to(:salt) }

  describe "Correct" do
    it "new user" do
      @user = User.new(email: "qwerty", password: "123456", password_confirmation: "123456")
      expect(@user.save).to be true
    end
  end

  describe "Incorrect" do
    describe "email" do
      it "email blank" do
        @user = User.new(email: "", password: "123456", password_confirmation: "123456")
        @user.valid?
        expect(@user.errors.messages[:email].length).to eq(1)
        expect(@user.errors.messages[:email][0]).
            to eq(I18n.t("activerecord.errors.models.user.attributes.email.blank"))
      end

      it "not unique" do
        FactoryGirl.create(:user, email: "qwerty", password: "123456", password_confirmation: "123456")
        @user = User.new(email: "qwerty", password: "123456", password_confirmation: "123456")
        @user.valid?
        expect(@user.errors.messages[:email].length).to eq(1)
        expect(@user.errors.messages[:email][0]).
            to eq(I18n.t("activerecord.errors.models.user.attributes.email.taken"))
      end

      it "upcase" do
        FactoryGirl.create(:user, email: "UpCaSE", password: "123456", password_confirmation: "123456")
        @user = User.new(email: "upcase", password: "123456", password_confirmation: "123456")
        @user.valid?
        expect(@user.errors.messages[:email].length).to eq(1)
        expect(@user.errors.messages[:email][0]).
            to eq(I18n.t("activerecord.errors.models.user.attributes.email.taken"))
      end
    end

    describe "password" do
      it "different passwords" do
        @user = User.new(email: "qwerty", password: "1234567", password_confirmation: "123456")
        @user.valid?
        expect(@user.errors.messages[:password_confirmation].length).to eq(1)
        expect(@user.errors.messages[:password_confirmation][0]).
            to eq(I18n.t("activerecord.errors.models.user.attributes.password_confirmation.confirmation"))
      end

      it "too short" do
        @user = User.new(email: "qwerty", password: "12", password_confirmation: "12")
        @user.valid?
        expect(@user.errors.messages[:password].length).to eq(1)
        expect(@user.errors.messages[:password][0]).
            to eq(I18n.t("activerecord.errors.models.user.attributes.password.too_short"))
      end

      it "blank" do
        @user = User.new(email: "qwerty", password: "", password_confirmation: "")
        @user.valid?
        expect(@user.errors.messages[:password].length).to eq(1)
        expect(@user.errors.messages[:password][0]).
            to eq(I18n.t("activerecord.errors.models.user.attributes.password.too_short"))
      end

      it "password_confirmation blank" do
        @user = User.new(email: "qwerty", password: "123456", password_confirmation: "")
        @user.valid?
        expect(@user.errors.messages[:password_confirmation].length).to eq(2)
        expect(@user.errors.messages[:password_confirmation][0]).
            to eq(I18n.t("activerecord.errors.models.user.attributes.password_confirmation.confirmation"))
        expect(@user.errors.messages[:password_confirmation][1]).
            to eq(I18n.t("activerecord.errors.models.user.attributes.password_confirmation.blank"))
      end
    end
  end
end
