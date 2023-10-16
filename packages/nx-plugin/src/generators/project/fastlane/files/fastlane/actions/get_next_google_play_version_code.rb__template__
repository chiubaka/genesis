module Fastlane
  module Actions
    class GetNextGooglePlayVersionCodeAction < Action
      def self.run(params)
        package_name = CredentialsManager::AppfileConfig.try_fetch_value(:package_name)
        google_play_key_file = CredentialsManager::AppfileConfig.try_fetch_value(:json_key_file)
        existing_version_codes = Actions::GooglePlayTrackVersionCodesAction.run(
          track: params[:track],
          package_name: package_name,
          json_key: google_play_key_file
        )

        if existing_version_codes.length == 0
          return 1
        end

        highest_version_code = existing_version_codes.max()
        return highest_version_code + 1
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

        # Below a few examples
        [
          FastlaneCore::ConfigItem.new(key: :track,
                                       env_name: "FL_GET_NEXT_GOOGLE_PLAY_VERSION_CODE_TRACK",
                                       description: "Gets the next available version code based on existing version codes from Google Play",
                                       default_value: "internal",
                                       verify_block: proc do |value|
                                         unless value && !value.empty?
                                           UI.user_error!('No track for GetNextGooglePlayVersionCodeAction given, pass using `track: "internal"`')
                                         end
                                         unless ["internal", "alpha", "beta", "production"].include?(value)
                                           UI.user_error!("Invalid track #{value} for GetNextGooglePlayVersionCodeAction. Valid values are [\"internal\", \"alpha\", \"beta\", \"production\"]")
                                         end
                                       end),
        ]
      end

      def self.output
        # Define the shared values you are going to provide
        []
      end

      def self.return_value
        # If your method provides a return value, you can describe here what it does
        return "An integer representing the next sequential version code available for use in Google Play on the given track"
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

        platform == :android
      end
    end
  end
end
