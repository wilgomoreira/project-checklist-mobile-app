import styled from 'styled-components/native';

export const Container = styled.View`
    flex:1;
    background-color: #eee;
`;

export const TitleArea = styled.View`
    border-bottom-width: 10px;
    border-bottom-style: solid;
    border-bottom-color: #fff;
    z-index: 99;
    background-color: #ccc;
    padding-top: 15px;
`;

export const Logo = styled.Text`
    font-size: 27px;
    text-align: center;
    color: #1B2B42;
    font-weight: bold;
`;

export const Title = styled.Text`
    font-size: 17px;
    margin-left: 15px;
    margin-top: 10px;
    color: #1B2B42;
`;

export const Input = styled.TextInput`
    height: 40px;
    margin-left: 15px;
    margin-bottom: 10px;
    margin-right: 15px;
    padding: 5px;
    border-radius: 5px;
    background-color: #FFF;
`;

export const CenterView = styled.View`
    align-items: center;
    flex-direction: row;
    justify-content: space-around;
    margin-bottom: 10px;
`;

export const Button = styled.TouchableOpacity`
    background-color: #1B2B42;
    height: 40px;
    border-radius: 7px;
    padding: 7px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const ButtonText = styled.Text`
    font-size: 17px;
    text-align: center;
    color: #fff;
`;

export const List = styled.FlatList.attrs({
    contentContainerStyle: { paddingHorizontal: 20 }
})`
    margin-top: 20px;
`;    
