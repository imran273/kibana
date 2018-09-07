/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { VectorSource } from './source';
import React, { Fragment } from 'react';
import {
  EuiText,
  EuiSelect,
  EuiSpacer
} from '@elastic/eui';
import { VectorLayer } from '../vector_layer';

export class KibanaRegionmapSource extends VectorSource {

  static type = 'REGIONMAP_FILE';

  /**
   * todo: needs to use name of the layer, not URL
   * similar to EMS-file source
   */
  static createDescriptor(url) {
    return {
      type: KibanaRegionmapSource.type,
      url
    };
  }

  static renderEditor = ({ dataSourcesMeta, onPreviewSource }) => {
    const regionmapOptionsRaw = (dataSourcesMeta) ? dataSourcesMeta.kibana.regionmap : [];
    const regionmapOptions = regionmapOptionsRaw ? regionmapOptionsRaw.map((file) => ({
      value: file.url,
      text: file.name
    })) : [];

    const onChange = ({ target }) => {
      const selectedUrl = target.options[target.selectedIndex].value;
      const kibanaRegionmapSourceDescriptor = KibanaRegionmapSource.createDescriptor(selectedUrl);
      const kibanaRegionmapSource = new KibanaRegionmapSource(kibanaRegionmapSourceDescriptor);
      onPreviewSource(kibanaRegionmapSource);
    };

    return (
      <EuiText>
        <Fragment>
          <EuiSpacer size="m"/>
          <EuiSelect
            hasNoInitialSelection
            options={regionmapOptions}
            onChange={onChange}
            aria-label="Use aria labels when no actual label is in use"
          />
        </Fragment>
      </EuiText>
    );
  };

  renderDetails() {
    return (
      <Fragment>
        <div>
          <span className="bold">Source: </span><span>Kibana Region Map</span>
        </div>
        <div>
          <span className="bold">Type: </span><span>Vector (todo, use icon)</span>
        </div>
        <div>
          <span className="bold">Name: </span><span>{this._descriptor.name}</span>
        </div>
      </Fragment>
    );
  }


  async getGeoJson() {
    try {
      const vectorFetch = await fetch(this._descriptor.url);
      return await vectorFetch.json();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  _createDefaultLayerDescriptor(options) {
    return VectorLayer.createDescriptor({
      sourceDescriptor: this._descriptor,
      ...options
    });
  }

  createDefaultLayer(options) {
    return new VectorLayer({
      layerDescriptor: this._createDefaultLayerDescriptor(options),
      source: this
    });
  }

  getDisplayName() {
    return this._descriptor.url + ' todo should use name from config instead';
  }

}