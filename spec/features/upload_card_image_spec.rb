require "rails_helper"
require "carrierwave/test/matchers"

describe "uploader", type: :feature do
  include CarrierWave::Test::Matchers

  before do
    @card = FactoryGirl.create(:card)
  end

  before do
    CardImageUploader.enable_processing = true
    @uploader = CardImageUploader.new(@card, :image)

    File.open("./spec/files/goose.JPG") do |f|
      @uploader.store!(f)
    end
  end

  after do
    CardImageUploader.enable_processing = false
    @uploader.remove!
  end

  context 'the main version' do
    it "should have dimensions not larger than 360 by 360 pixels" do
      expect(@uploader).to be_no_larger_than(360, 360)
    end
  end

  context 'the thumb version' do
    it "should scale down a landscape image to be exactly 100 by 75 pixels" do
      expect(@uploader.thumb).to have_dimensions(100, 75)
    end
  end

  # it "should be the correct format" do
  #   expect(@uploader).to be_format('JPG')
  # end
end
