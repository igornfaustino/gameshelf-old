import React, { useMemo, useCallback } from 'react';

import { useQuery } from '@apollo/react-hooks';
import { Select } from 'antd';
import { Platform, Genres } from '../types/common';
import { GET_PLATFORMS, GET_GENRES } from '../helpers/queries';

const { Option } = Select;

interface PlatformQuery {
  platforms: Platform[];
}

interface GenreQuery {
  genres: Genres[];
}

interface FormProps {
  setPlatforms: React.Dispatch<React.SetStateAction<number[] | undefined>>;
  setGenres: React.Dispatch<React.SetStateAction<number[] | undefined>>;
}

const FilterForm: React.FC<FormProps> = ({ setPlatforms, setGenres }) => {
  const { data: platformData } = useQuery<PlatformQuery>(GET_PLATFORMS, {
    pollInterval: 10000,
  });

  const { data: genreData } = useQuery<GenreQuery>(GET_GENRES, {
    pollInterval: 10000,
  });

  const platformOptions = useMemo(
    () =>
      platformData?.platforms.map((platform) => (
        <Option key={platform.id} value={platform.id}>
          {platform.name}
        </Option>
      )),
    [platformData]
  );

  const genreOptions = useMemo(
    () =>
      genreData?.genres.map((genre) => (
        <Option key={genre.id} value={genre.id}>
          {genre.name}
        </Option>
      )),
    [genreData]
  );

  const handlePlatformSelect = useCallback(
    (values) => {
      if (values.length > 0) {
        return setPlatforms(values.map((v: string) => Number(v)));
      }
      return setPlatforms(undefined);
    },
    [setPlatforms]
  );

  const handleGenreSelect = useCallback(
    (values) => {
      if (values.length > 0) {
        return setGenres(values.map((v: string) => Number(v)));
      }
      return setGenres(undefined);
    },
    [setGenres]
  );

  return (
    <form>
      <Select
        mode="multiple"
        style={{ width: '100%' }}
        placeholder="Select a game platform"
        onChange={handlePlatformSelect}
        optionFilterProp="children"
        filterOption
      >
        {platformOptions}
      </Select>
      <Select
        mode="multiple"
        style={{ width: '100%' }}
        placeholder="Select a game genre"
        optionFilterProp="children"
        onChange={handleGenreSelect}
      >
        {genreOptions}
      </Select>
    </form>
  );
};

export default FilterForm;
