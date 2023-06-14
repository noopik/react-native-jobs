import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Stack, useRouter, useSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import {
  Company,
  JobAbout,
  JobFooter,
  JobTabs,
  ScreenHeaderBtn,
  Specifics,
} from '../../components';
import { COLORS, icons, SIZES } from '../../constants';
import useFetch from '../../hooks/useFetch';
import { detailJobTabs } from '../../constants/tabs';

// const tabs = ['About', 'Qualifications', 'Responsibilities'];
const JobDetails = () => {
  const params = useSearchParams();
  const router = useRouter();

  const { data, isLoading, error, refetch } = useFetch('job-details', {
    job_id: params.id,
  });

  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState(detailJobTabs[0]);
  const onRefresh = () => {};

  const displayTabContent = () => {
    switch (activeTab) {
      case detailJobTabs[0]:
        return (
          <JobAbout
            info={detailJobTabs[0]}
            points={data[0]?.job_description ?? 'No data provided'}
          />
        );
      case detailJobTabs[1]:
        return (
          <Specifics
            title={detailJobTabs[1]}
            points={data[0]?.job_highlights?.Qualifications ?? ['N/A']}
          />
        );
      case detailJobTabs[2]:
        return (
          <Specifics
            title={detailJobTabs[2]}
            points={data[0]?.job_highlights?.Responsibilities ?? ['N/A']}
          />
        );

      default:
        break;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerBackVisible: false,
          headerLeft: () => (
            <ScreenHeaderBtn
              iconUrl={icons.left}
              dimension={'60%'}
              handlePress={() => router.back()}
            />
          ),
          headerRight: () => (
            <ScreenHeaderBtn iconUrl={icons.share} dimension={'60%'} />
          ),
          headerTitle: '',
        }}
      />
      <>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {isLoading ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : error ? (
            <Text>Something went wrong</Text>
          ) : (
            <View style={{ padding: SIZES.medium, paddingBottom: 100 }}>
              <Company
                companyLogo={data[0]?.employer_logo}
                jobTitle={data[0]?.job_title}
                companyName={data[0]?.employer_name}
                location={data[0]?.job_country}
              />
              <JobTabs
                tabs={detailJobTabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
              {displayTabContent()}
            </View>
          )}
        </ScrollView>

        <JobFooter
          url={
            data[0]?.job_google_link ?? 'https://careers.google.com/jobs/result'
          }
        />
      </>
    </SafeAreaView>
  );
};

export default JobDetails;
