import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Theme } from '../../theme/types';
import { useStyles } from '../../theme/utils';
import { moderateScale } from 'react-native-size-matters';

type Props = {
  title: string;
  styleContainer?: ViewStyle;
};

export const ScreenHeader: React.FC<Props> = ({
  title,
  styleContainer = {},
}) => {
  const style = useStyles(createStyles(styleContainer));

  return (
    <View style={style.container}>
      <Text style={style.titleText}>{title}</Text>
    </View>
  );
};

const createStyles = (styleContainer: ViewStyle) => (theme: Theme) => {
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      ...styleContainer,
    },
    titleText: {
      fontSize: moderateScale(24),
      fontFamily: theme.font.bold,
      color: theme.color.text1,
    },
  });

  return styles;
};
