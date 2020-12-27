import React from 'react'

import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import NavigationItems from './NavigationItems'
import NavigationItem from './NavigationItem/NavigationItem'

configure({ adapter: new Adapter() })

describe('<NavigationItems />', () => {
  let wrapper;

  beforeEach(() => {
    // shallow renders component with all content but it is not rendered deeply.
    // just want to render the component and know what is inside it.
    wrapper = shallow(<NavigationItems />)
  })

  it('should render two <NavigationItem /> elements if not authenticated', () => {

    expect(wrapper.find(NavigationItem)).toHaveLength(2);
  })

  it('should render three <NavigationItem /> elements if authenticated', () => {
    // isAuthenticated passed in as true
    wrapper.setProps({ isAuthenticated: true })
    expect(wrapper.find(NavigationItem)).toHaveLength(3);
  })

  it('should render a Logout <NavigationItem /> element if authenticated', () => {
    wrapper.setProps({ isAuthenticated: true })
    expect(wrapper.contains(<NavigationItem link="/logout">Logout</NavigationItem>)).toEqual(true);
  })
})