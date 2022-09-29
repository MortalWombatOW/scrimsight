import {Autocomplete, IconButton, TextField} from '@mui/material';
import React, {useEffect, useRef, useState} from 'react';
import './SearchBar.scss';
import SearchIcon from '@mui/icons-material/Search';
import {useSpring, to, animated, useSpringRef, useChain} from 'react-spring';
import {useOutsideAlerter} from '../../hooks/useOutsideAlerter';
import {
  CalendarViewMonth,
  Groups,
  Person,
  PersonSearch,
} from '@mui/icons-material';
import Map from '@mui/icons-material/Map';
// An input field for filtering the data.
// The filters map the metric group to the members of the group that are currently selected.
// The setFilters callback is used to update the filters.
const SearchBar = ({
  filters,
  setFilters,
  allOptions,
}: {
  filters: {[key: string]: string[]};
  setFilters: (filters: {[key: string]: string[]}) => void;
  allOptions: {[key: string]: string}[];
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  useOutsideAlerter(wrapperRef, () => {
    // searchboxOpacityApi.start();

    setIsActive(false);
  });
  const [search, setSearch] = useState<string>('');
  const [searching, setSearching] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);

  const iconSpringRef = useSpringRef();
  const [{iconPosition}] = useSpring(
    {
      ref: iconSpringRef,
      to: {
        iconPosition: isActive ? '0' : '200px',
      },
    },
    [isActive],
  );
  const searchBoxSpringRef = useSpringRef();
  const [{searchBoxOpcacity}] = useSpring(
    {
      ref: searchBoxSpringRef,
      to: {
        searchBoxOpcacity: isActive ? '1' : '0',
      },
    },
    [isActive],
  );

  // useEffect(() => {
  //   if (isActive) {
  //     inputRef!.current!.focus();
  //   }
  // }, [isActive]);
  useChain(
    !isActive
      ? [searchBoxSpringRef, iconSpringRef]
      : [iconSpringRef, searchBoxSpringRef],
    [0, !isActive ? 0.5 : 0.5],
  );

  const filterButtons: {
    icon: React.ReactElement;
    label: string;
    onClick?: () => void;
    color: string;
  }[] = [
    {
      icon: <Person />,
      label: 'Player',
      color: '#3e7dca',
    },
    {
      icon: <Groups />,
      label: 'Team',
      color: '#468c43',
    },
    {
      icon: <Map />,
      label: 'Map',
      color: '#be736e',
    },
    {
      icon: <CalendarViewMonth />,
      label: 'Date',
      color: '#7359ba',
    },
  ];

  return (
    <div className="searchbar" ref={wrapperRef}>
      <animated.span
        {...{
          style: {
            marginLeft: to([iconPosition], (x) => `${x}`),
          },
        }}>
        <IconButton>
          <SearchIcon
            onClick={() => setIsActive(true)}
            className="searchicon"
          />
        </IconButton>
      </animated.span>
      <animated.span
        {...{
          style: {
            opacity: to([searchBoxOpcacity], (x) => `${x}`),
          },
        }}>
        {filterButtons.map((filterButton) => (
          <IconButton
            key={filterButton.label}
            onClick={() => filterButton.onClick && filterButton.onClick()}
            sx={{
              color: filterButton.color,
            }}>
            {filterButton.icon}
          </IconButton>
        ))}
        {/* <Autocomplete
          className="searchbar-input"
          renderInput={(params) => (
            <TextField
              {...params}
              inputRef={inputRef}
              label="Search"
              variant="standard"
              style={{
                color: '#ccc !important',
              }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          )}
          {...{
            style: {
              width: '300px',
              pointerEvents: to([searchBoxOpcacity], (x) =>
                x !== '0' ? 'auto' : 'none',
              ),
            },
          }}
          options={allOptions}
          getOptionLabel={(option) => option.foo}
          color="secondary"
        /> */}
      </animated.span>
    </div>
  );
};

export default SearchBar;
