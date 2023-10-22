require "dotenv"

module Fastlane
  module Actions
    module SharedValues
      APP_STORE_CONNECT_APP_ID = :APP_STORE_CONNECT_APP_ID
    end

    class RegisterAppWithAppleAction < Action
      ENV_FILE_PATH = "#{__dir__}/../Fastlane.env"
      USERNAME = CredentialsManager::AppfileConfig.try_fetch_value(:apple_id)
      APP_IDENTIFIER = CredentialsManager::AppfileConfig.try_fetch_value(:app_identifier)

      def self.run(params)
        Dotenv.load(ENV_FILE_PATH)
        app_name = ENV["APP_NAME"]

        app_store_connect_app_id = Actions::ProduceAction.run(
          username: USERNAME,
          app_identifier: APP_IDENTIFIER,
          app_name: app_name,
        )

        Actions.lane_context[SharedValues::APP_STORE_CONNECT_APP_ID] = app_store_connect_app_id


        already_saved_app_id = false

        open(ENV_FILE_PATH, "r") do |f|
          already_saved_app_id = f.read.include? "APP_STORE_CONNECT_APP_ID="
        end

        unless already_saved_app_id
          puts "Saving app_store_connect_app_id to Fastlane.env"
          open(ENV_FILE_PATH, "a") do |f|
            f.puts "APP_STORE_CONNECT_APP_ID=#{app_store_connect_app_id}"
          end
        else
          puts "APP_STORE_CONNECT_APP_ID value already exists in Fastlane.env"
        end

        return app_store_connect_app_id
      end

      #####################################################
      # @!group Documentation
      #####################################################

      def self.description
        "A short description with <= 80 characters of what this action does"
      end

      def self.details
        # Optional:
        # this is your chance to provide a more detailed description of this action
        "You can use this action to do cool things..."
      end

      def self.available_options
        # Define all options your action supports.
        []
      end

      def self.output
        # Define the shared values you are going to provide
        []
      end

      def self.return_value
        # If your method provides a return value, you can describe here what it does
        "The App Store Connect app ID corresponding to the apple_id parameter passed to upload_to_testflight"
      end

      def self.authors
        # So no one will ever forget your contribution to fastlane :) You are awesome btw!
        ["@chiubaka"]
      end

      def self.is_supported?(platform)
        # you can do things like
        #
        #  true
        #
        #  platform == :ios
        #
        #  [:ios, :mac].include?(platform)
        #

        platform == :ios
      end
    end
  end
end
