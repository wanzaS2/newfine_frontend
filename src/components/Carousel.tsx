import React from 'react';
import {Dimensions, FlatList, View} from 'react-native';
import styled from 'styled-components/native';

type CarouselProps = {
  gap: number;
  RenderItem: ({page, item}: {page: number; item: any}) => JSX.Element;
  pageWidth: number;
  data: any[];
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  contentOffset?: {x: number; y: number};
};

const Indicator = styled.View<{focused: boolean}>`
  margin: 0px 4px;
  background-color: ${props => (props.focused ? '#262626' : '#dfdfdf')};
  width: 6px;
  height: 6px;
  border-radius: 3px;
`;

const IndicatorWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 16px;
`;

const {width} = Dimensions.get('window');

function Carousel({
  gap,
  RenderItem,
  pageWidth,
  data,
  page,
  setPage,
  contentOffset,
}: CarouselProps) {
  const onScroll = (e: any) => {
    const newPage = Math.round(
      e.nativeEvent.contentOffset.x / (pageWidth + gap),
    );
    setPage(newPage);
  };

  return (
    <View
      style={{justifyContent: 'center', alignItems: 'center', height: '60%'}}>
      <FlatList
        // style={{backgroundColor: 'pink'}}
        contentContainerStyle={{
          paddingHorizontal: (width - pageWidth - gap) / 2,
        }}
        contentOffset={contentOffset}
        onScroll={onScroll}
        decelerationRate="fast"
        snapToInterval={pageWidth + gap}
        snapToAlignment="start"
        pagingEnabled
        horizontal
        keyExtractor={item => String(item.id)}
        data={data}
        renderItem={({item}) => (
          <View style={{marginHorizontal: gap / 2}}>
            <RenderItem page={page} item={item} />
          </View>
        )}
        showsHorizontalScrollIndicator={false}
      />
      <IndicatorWrapper>
        {Array.from({length: data.length}, (_, i) => i).map(i => (
          <Indicator key={`indicator_${i}`} focused={i === page} />
        ))}
      </IndicatorWrapper>
    </View>
  );
}

export default Carousel;
