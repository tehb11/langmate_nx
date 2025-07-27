import React, { useContext, useEffect } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

import { Theme } from '../../theme/types';
import { useStyles } from '../../theme/utils';
import { useUsers } from '@langmate/services';
import { ThemeContext } from '../../theme';
import { UsersListItem } from './UsersListItem';
import { isAxiosError } from 'axios';
import { alert } from '../../shared/ui/Alert';

export const UsersList = () => {
  const styles = useStyles(createStyles);

  const { theme } = useContext(ThemeContext);

  const { data, refetch, isFetching, error } = useUsers();

  useEffect(() => {
    if (error) {
      if (isAxiosError(error)) {
        alert.show({
          title: 'Error',
          message: error?.response?.data?.message || 'Try later',
        });
      }
    }
  }, [error]);

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
      keyExtractor={(item) => item.id}
      data={data?.data || []}
      renderItem={({ item }) => (
        <UsersListItem item={item} styleContainer={styles.itemContainer} />
      )}
      ListEmptyComponent={<Text style={styles.emptyText}>No users</Text>}
      refreshControl={
        <RefreshControl refreshing={isFetching} onRefresh={refetch} />
      }
    />
  );
};

const createStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    contentContainer: {
      paddingHorizontal: moderateScale(10),
    },
    itemContainer: {
      marginTop: moderateScale(10),
    },
    headerText: {
      fontSize: moderateScale(22),
      fontFamily: theme.font.bold,
      color: theme.color.text1,
    },
    emptyText: {
      fontSize: moderateScale(16),
      fontFamily: theme.font.regular,
      color: theme.color.text1,
    },
  });

  return styles;
};
